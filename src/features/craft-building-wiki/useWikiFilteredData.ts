import { useMemo } from 'react';
import { CRAFTING_RECIPES } from './craftingData';
import { BUILDING_CATALOGUE } from './buildingData';
import { TOOLS_CATALOGUE } from './toolsData';
import { LAB_RESEARCH_CATALOGUE } from './labResearchData';
import { OCEAN_TECH_CATALOGUE } from './oceanTechData';
import { CatalogDomain } from './wikiConstants';

interface UseWikiFilteredDataParams {
  activeMode: CatalogDomain;
  searchQuery: string;
  selectedCategory: string;
  selectedUnlockSource: string;
  sortBy: 'name' | 'unlock' | 'cost';
  getItemName: (key: string, fallback: string) => string;
  getBuildingName: (key: string, fallback: string) => string;
  getCategoryName: (cat: string) => string;
  getUnlockSourceName: (src: string) => string;
}

export function useWikiFilteredData({
  searchQuery,
  selectedCategory,
  selectedUnlockSource,
  sortBy,
  getItemName,
  getBuildingName,
  getCategoryName,
  getUnlockSourceName
}: UseWikiFilteredDataParams) {
  const q = searchQuery.toLowerCase().trim();

  const filteredRecipes = useMemo(() => {
    return CRAFTING_RECIPES.filter(recipe => {
      if (selectedCategory !== 'All' && recipe.category !== selectedCategory) return false;
      if (selectedUnlockSource !== 'All' && recipe.unlock.source !== selectedUnlockSource) return false;
      if (q) {
        const locName = getItemName(recipe.name, recipe.name).toLowerCase();
        const matchesName = recipe.name.toLowerCase().includes(q) || locName.includes(q);
        const matchesCat = recipe.category.toLowerCase().includes(q) || getCategoryName(recipe.category).toLowerCase().includes(q);
        const matchesDesc = recipe.description.toLowerCase().includes(q);
        const matchesUnlock = recipe.unlock.description.toLowerCase().includes(q) || getUnlockSourceName(recipe.unlock.source).toLowerCase().includes(q);
        const matchesMat = recipe.materials.some(
          m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q)
        );
        if (!matchesName && !matchesCat && !matchesDesc && !matchesUnlock && !matchesMat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return getItemName(a.name, a.name).localeCompare(getItemName(b.name, b.name));
      if (sortBy === 'unlock') return (a.unlock.level || 0) - (b.unlock.level || 0);
      if (sortBy === 'cost') return (b.sellPrice || 0) - (a.sellPrice || 0);
      return 0;
    });
  }, [selectedCategory, selectedUnlockSource, q, sortBy, getItemName, getCategoryName, getUnlockSourceName]);

  const filteredBuildings = useMemo(() => {
    return BUILDING_CATALOGUE.filter(b => {
      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
      if (selectedUnlockSource !== 'All' && !b.tiers.some(t => t.unlock.source === selectedUnlockSource)) return false;
      if (q) {
        const locName = getBuildingName(b.name, b.name).toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q) || locName.includes(q);
        const matchesCat = b.category.toLowerCase().includes(q) || getCategoryName(b.category).toLowerCase().includes(q);
        const matchesBuilder = b.builder.toLowerCase().includes(q);
        const matchesTiers = b.tiers.some(
          t =>
            t.name.toLowerCase().includes(q) ||
            getBuildingName(t.name, t.name).toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.materials.some(m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q))
        );
        if (!matchesName && !matchesCat && !matchesBuilder && !matchesTiers) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return getBuildingName(a.name, a.name).localeCompare(getBuildingName(b.name, b.name));
      if (sortBy === 'cost') return (b.tiers[0]?.goldCost || 0) - (a.tiers[0]?.goldCost || 0);
      return 0;
    });
  }, [selectedCategory, selectedUnlockSource, q, sortBy, getItemName, getBuildingName, getCategoryName]);

  const filteredTools = useMemo(() => {
    return TOOLS_CATALOGUE.filter(tool => {
      if (selectedCategory !== 'All' && tool.category !== selectedCategory) return false;
      if (q) {
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesShop = tool.shop.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesTiers = tool.tiers.some(
          t =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.materials.some(m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q))
        );
        if (!matchesName && !matchesShop && !matchesDesc && !matchesTiers) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'cost') return (b.tiers[1]?.goldCost || 0) - (a.tiers[1]?.goldCost || 0);
      return 0;
    });
  }, [selectedCategory, q, sortBy, getItemName]);

  const filteredLabResearch = useMemo(() => {
    return LAB_RESEARCH_CATALOGUE.filter(lab => {
      if (selectedCategory !== 'All' && lab.category !== selectedCategory) return false;
      if (selectedUnlockSource !== 'All' && !lab.tiers.some(t => t.unlock.source === selectedUnlockSource)) return false;
      if (q) {
        const matchesName = lab.name.toLowerCase().includes(q);
        const matchesDesc = lab.description.toLowerCase().includes(q);
        const matchesTiers = lab.tiers.some(
          t =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.benefits.some(ben => ben.toLowerCase().includes(q)) ||
            t.materials.some(m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q))
        );
        if (!matchesName && !matchesDesc && !matchesTiers) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'cost') return (b.tiers[0]?.goldCost || 0) - (a.tiers[0]?.goldCost || 0);
      return 0;
    });
  }, [selectedCategory, selectedUnlockSource, q, sortBy, getItemName]);

  const filteredOceanTech = useMemo(() => {
    return OCEAN_TECH_CATALOGUE.filter(tech => {
      if (selectedCategory !== 'All' && tech.category !== selectedCategory) return false;
      if (selectedUnlockSource !== 'All' && !tech.tiers.some(t => t.unlock.source === selectedUnlockSource)) return false;
      if (q) {
        const matchesName = tech.name.toLowerCase().includes(q);
        const matchesDesc = tech.description.toLowerCase().includes(q);
        const matchesSource = tech.source.toLowerCase().includes(q);
        const matchesTiers = tech.tiers.some(
          t =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.benefits.some(ben => ben.toLowerCase().includes(q)) ||
            t.materials.some(m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q))
        );
        if (!matchesName && !matchesDesc && !matchesSource && !matchesTiers) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'cost') return (b.tiers[0]?.goldCost || 0) - (a.tiers[0]?.goldCost || 0);
      return 0;
    });
  }, [selectedCategory, selectedUnlockSource, q, sortBy, getItemName]);

  return {
    filteredRecipes,
    filteredBuildings,
    filteredTools,
    filteredLabResearch,
    filteredOceanTech
  };
}
