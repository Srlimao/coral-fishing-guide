-- LiveFishingBridge for Coral Island (UE4SS Mod v2.2.0)
-- Full Game State + Museum + Lake Temple Offerings + Caught Live Sync

local UEHelpers = require("UEHelpers")

print("\n================ [LiveFishingBridge v2.2.0] Initializing ================\n")

local OUTPUT_FILE_WORKSPACE = "D:\\Apps\\CoralFishGuide\\live_game_state.json"
local OUTPUT_FILE_LOCAL = "live_game_state.json"

local lastJsonState = ""

-- Helper: Convert string/enum season to standard lowercase
local function MapSeasonEnum(seasonEnum)
    if seasonEnum == 1 or seasonEnum == "1" or seasonEnum == "Spring" then return "spring" end
    if seasonEnum == 2 or seasonEnum == "2" or seasonEnum == "Summer" then return "summer" end
    if seasonEnum == 3 or seasonEnum == "3" or seasonEnum == "Fall" then return "fall" end
    if seasonEnum == 4 or seasonEnum == "4" or seasonEnum == "Winter" then return "winter" end
    local s = string.lower(tostring(seasonEnum or ""))
    if string.find(s, "spring") or string.find(s, "primavera") then return "spring" end
    if string.find(s, "summer") or string.find(s, "verao") or string.find(s, "verão") then return "summer" end
    if string.find(s, "fall") or string.find(s, "autumn") or string.find(s, "outono") then return "fall" end
    if string.find(s, "winter") or string.find(s, "inverno") then return "winter" end
    return "spring"
end

-- Helper: Convert string/enum weather to standard lowercase
local function MapWeatherEnum(weatherEnum)
    if weatherEnum == 1 or weatherEnum == "1" or weatherEnum == "Sunny" then return "sunny" end
    if weatherEnum == 2 or weatherEnum == "2" or weatherEnum == "Rain" then return "rain" end
    if weatherEnum == 3 or weatherEnum == "3" or weatherEnum == "Storm" then return "storm" end
    if weatherEnum == 4 or weatherEnum == "4" or weatherEnum == "Windy" then return "windy" end
    if weatherEnum == 5 or weatherEnum == "5" or weatherEnum == "Snow" then return "snow" end
    if weatherEnum == 6 or weatherEnum == "6" or weatherEnum == "Blizzard" then return "blizzard" end
    local w = string.lower(tostring(weatherEnum or ""))
    if string.find(w, "sunny") or string.find(w, "clear") or string.find(w, "ensolarado") or string.find(w, "limpo") then return "sunny" end
    if string.find(w, "blizzard") or string.find(w, "nevasca") then return "blizzard" end
    if string.find(w, "storm") or string.find(w, "thunder") or string.find(w, "tempestade") then return "storm" end
    if string.find(w, "rain") or string.find(w, "chuva") then return "rain" end
    if string.find(w, "snow") or string.find(w, "neve") then return "snow" end
    if string.find(w, "wind") or string.find(w, "vento") or string.find(w, "ventania") then return "windy" end
    return "sunny"
end

-- Helper: Convert hour to time period
local function GetTimeOfDay(hour)
    hour = tonumber(hour) or 6
    if hour >= 6 and hour < 12 then return "morning" end
    if hour >= 12 and hour < 16 then return "afternoon" end
    if hour >= 16 and hour < 20 then return "evening" end
    return "night"
end

local function WriteStateJson(jsonString)
    if jsonString == lastJsonState then return end
    lastJsonState = jsonString

    local function TryWrite(path)
        local f = io.open(path, "w")
        if f then
            f:write(jsonString)
            f:flush()
            f:close()
            return true
        end
        return false
    end

    TryWrite(OUTPUT_FILE_WORKSPACE)
    TryWrite(OUTPUT_FILE_LOCAL)
end

-- Telemetry Tick
local function TickBridge()
    ExecuteInGameThread(function()
        local state = {
            connected = true,
            inGame = true,
            timestamp = os.time(),
            season = "spring",
            day = 1,
            year = 1,
            hour = 6,
            minute = 0,
            formattedTime = "06:00 AM",
            timeOfDay = "morning",
            weather = "sunny",
            fishingLevel = 0,
            rodTier = "makeshift",
            caughtFish = {},
            donatedFish = {},
            offeredFish = {}
        }

        local gs = FindFirstOf("BP_GameState_C") or FindFirstOf("AC_GameState") or FindFirstOf("GameState")
        local timeMgr = nil
        local weatherMgr = nil
        local museumMgr = nil
        local offeringMgr = nil

        if gs and gs:IsValid() then
            pcall(function() if gs.GetTimeManager then timeMgr = gs:GetTimeManager() end end)
            if not timeMgr and gs.timeManager and gs.timeManager:IsValid() then timeMgr = gs.timeManager end

            pcall(function() if gs.GetWeatherManager then weatherMgr = gs:GetWeatherManager() end end)
            if not weatherMgr and gs.weatherManager and gs.weatherManager:IsValid() then weatherMgr = gs.weatherManager end

            if gs.museumDonationComponent and gs.museumDonationComponent:IsValid() then
                museumMgr = gs.museumDonationComponent
            end
            if gs.offeringComponent and gs.offeringComponent:IsValid() then
                offeringMgr = gs.offeringComponent
            end
        end

        if not timeMgr or not timeMgr:IsValid() then
            timeMgr = FindFirstOf("UC_TimeManagerComponent")
        end
        if not weatherMgr or not weatherMgr:IsValid() then
            weatherMgr = FindFirstOf("UC_WeatherManagerComponent")
        end
        if not museumMgr or not museumMgr:IsValid() then
            museumMgr = FindFirstOf("UC_MuseumDonationComponent")
        end
        if not offeringMgr or not offeringMgr:IsValid() then
            offeringMgr = FindFirstOf("UC_OfferingComponent")
        end

        -- 1. Read Time & Date
        if timeMgr and timeMgr:IsValid() then
            pcall(function()
                local curDate = timeMgr:GetCurrentDate()
                if curDate then
                    if curDate.day then state.day = tonumber(curDate.day) or state.day end
                    if curDate.season ~= nil then state.season = MapSeasonEnum(curDate.season) end
                    if curDate.year then state.year = tonumber(curDate.year) or state.year end
                end
            end)

            pcall(function()
                local curTime = timeMgr:GetCurrentTime()
                if curTime then
                    if curTime.Hours ~= nil then state.hour = tonumber(curTime.Hours) or state.hour end
                    if curTime.Minutes ~= nil then state.minute = tonumber(curTime.Minutes) or state.minute end
                end
            end)
        end

        -- 2. Read Weather
        if weatherMgr and weatherMgr:IsValid() then
            pcall(function()
                if weatherMgr.GetCurrentWeather then
                    local w = weatherMgr:GetCurrentWeather()
                    if w ~= nil then state.weather = MapWeatherEnum(w) end
                elseif weatherMgr.currentWeather ~= nil then
                    state.weather = MapWeatherEnum(weatherMgr.currentWeather)
                end
            end)
        end

        -- 3. Read Museum Donated Items
        if museumMgr and museumMgr:IsValid() then
            pcall(function()
                local donatedArray = museumMgr.donatedItems
                if donatedArray then
                    local count = #donatedArray
                    local donatedSet = {}
                    for i = 1, count do
                        local info = donatedArray[i]
                        if info and info.ItemId then
                            local nameStr = tostring(info.ItemId.Name or "")
                            local valStr = tostring(info.ItemId.Value or "")
                            if nameStr ~= "None" and nameStr ~= "" then
                                donatedSet[nameStr] = true
                            elseif valStr ~= "0" and valStr ~= "" then
                                donatedSet[valStr] = true
                            end
                        end
                    end
                    for k, _ in pairs(donatedSet) do
                        table.insert(state.donatedFish, k)
                    end
                end
            end)
        end

        -- 4. Read Lake Temple Offerings
        if offeringMgr and offeringMgr:IsValid() then
            pcall(function()
                local offeredSet = {}
                -- Completed groups
                if offeringMgr.completeOfferingGroups then
                    for i = 1, #offeringMgr.completeOfferingGroups do
                        local g = tostring(offeringMgr.completeOfferingGroups[i])
                        if g ~= "None" and g ~= "" then
                            offeredSet[g] = true
                        end
                    end
                end
                -- Replicated data
                if offeringMgr.offeringsReplicationData then
                    for i = 1, #offeringMgr.offeringsReplicationData do
                        local rep = offeringMgr.offeringsReplicationData[i]
                        if rep and rep.complete then
                            offeredSet[tostring(rep.offeringIdIndex)] = true
                        end
                        if rep and rep.placedItems then
                            for j = 1, #rep.placedItems do
                                local item = rep.placedItems[j]
                                if item and item.itemData and item.itemData.ItemId then
                                    local nameStr = tostring(item.itemData.ItemId.Name or "")
                                    if nameStr ~= "None" and nameStr ~= "" then
                                        offeredSet[nameStr] = true
                                    end
                                end
                            end
                        end
                    end
                end
                for k, _ in pairs(offeredSet) do
                    table.insert(state.offeredFish, k)
                end
            end)
        end

        -- 5. Calculate Time of Day & Clock
        state.timeOfDay = GetTimeOfDay(state.hour)
        local displayHour = state.hour
        local ampm = "AM"
        if displayHour >= 12 then
            ampm = "PM"
            if displayHour > 12 then displayHour = displayHour - 12 end
        elseif displayHour == 0 then
            displayHour = 12
        end
        state.formattedTime = string.format("%02d:%02d %s", displayHour, state.minute, ampm)

        -- Format JSON lists
        local function ToJsonArray(tbl)
            local items = {}
            for _, v in ipairs(tbl) do
                table.insert(items, string.format('"%s"', v))
            end
            return "[" .. table.concat(items, ", ") .. "]"
        end

        local json = string.format([[{
  "connected": true,
  "inGame": true,
  "timestamp": %d,
  "season": "%s",
  "day": %d,
  "year": %d,
  "hour": %d,
  "minute": %d,
  "formattedTime": "%s",
  "timeOfDay": "%s",
  "weather": "%s",
  "fishingLevel": %d,
  "rodTier": "%s",
  "caughtFish": %s,
  "donatedFish": %s,
  "offeredFish": %s
}]],
            state.timestamp,
            state.season,
            state.day,
            state.year,
            state.hour,
            state.minute,
            state.formattedTime,
            state.timeOfDay,
            state.weather,
            state.fishingLevel,
            state.rodTier,
            ToJsonArray(state.caughtFish),
            ToJsonArray(state.donatedFish),
            ToJsonArray(state.offeredFish)
        )

        WriteStateJson(json)
    end)
end

LoopAsync(1000, function()
    pcall(TickBridge)
    return false
end)

print("[LiveFishingBridge] Ready v2.2.0 (Collections Sync Active).\n")
