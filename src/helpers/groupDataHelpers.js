import isEqual from 'deep-equal';
import ProjectAPI from './ProjectAPI';

function isVerseMatch(checkRef, contextIdRef) {
  return (checkRef.chapter === contextIdRef.chapter) &&
    (checkRef.verse === contextIdRef.verse);
}

/**
 * @description gets the group data for the current verse from groupsDataReducer
 * @param {Object} groupsData
 * @param {Array} groupsDataKeys - quick lookup for keys in groupsData
 * @param {Object} contextId
 * @return {object} group data object.
 */
export function getGroupDataForVerse(groupsData, groupsDataKeys, contextId) {
  const filteredGroupData = {};

  for (let i = groupsDataKeys.length - 1; i >= 0; i--) {
    const groupItemKey = groupsDataKeys[i];
    const groupItem = groupsData[groupItemKey];

    if (groupItem) {
      for (let j = groupItem.length - 1; j >= 0; j--) {
        const check = groupItem[j];

        try {
          if (isVerseMatch(check.contextId.reference, contextId.reference)) {
            if (!filteredGroupData[groupItemKey]) {
              filteredGroupData[groupItemKey] = [];
            }
            filteredGroupData[groupItemKey].push(check);
          }
        } catch (e) {
          console.warn(`Corrupt check found in group "${groupItemKey}"`, check);
        }
      }
    }
  }
  return filteredGroupData;
}

/**
 * Loads all of a tool's group data from the project.
 * @param {string} toolName - the name of the tool who's helps will be loaded
 * @param {string} projectDir - the absolute path to the project
 * @returns {*}
 */
export function loadProjectGroupData(toolName, projectDir) {
  const project = new ProjectAPI(projectDir);
  return project.getGroupsData(toolName);
}

/**
 * Generates a chapter-based group index.
 * Most tools will use a chapter based-index.
 * TODO: do not localize the group name here. Instead localize it as needed. See todo on {@link loadProjectGroupIndex}
 * @param {function} translate - the locale function
 * @param {number} [numChapters=150] - the number of chapters to generate
 * @return {*}
 */
export const generateChapterGroupIndex = (translate, numChapters = 150) => {
  const chapterLocalized = translate('tools.chapter') || 'Chapter';

  return Array(numChapters).fill().map((_, i) => {
    let chapter = i + 1;
    return {
      id: 'chapter_' + chapter,
      name: chapterLocalized + ' ' + chapter,
    };
  });
};

/**
 * searches groupData for a match for contextId (groupData must be for same groupId)
 * @param {Object} contextId
 * @param {Array} groupData for same groupId as contextId
 * @return {number} - returns index of match or -1
 */
export const findGroupDataItem = (contextId, groupData) => {
  let index = -1;
  const isQuoteString = typeof contextId.quote === 'string';

  for (let i = groupData.length - 1; i >= 0; i--) {
    const grpContextId = groupData[i].contextId;

    if (isSameVerse(grpContextId, contextId) &&
      (grpContextId.occurrence === contextId.occurrence) &&
      (isQuoteString ? (grpContextId.quote === contextId.quote) :
        isEqual(grpContextId.quote, contextId.quote))) {
      index = i;
      break;
    }
  }
  return index;
};

/**
 * make sure context IDs are for same verse.  Optimized over isEqual()
 * @param {Object} contextId1
 * @param {Object} contextId2
 * @return {boolean} returns true if context IDs are for same verse
 */
export function isSameVerse(contextId1, contextId2) {
  return (contextId1.reference.chapter === contextId2.reference.chapter) &&
    (contextId1.reference.verse === contextId2.reference.verse);
}
