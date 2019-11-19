import fs from 'fs-extra';
import { batchActions } from 'redux-batched-actions';
import delay from '../../utils/delay';
import Repo from '../../helpers/Repo';
import { findGroupDataItem } from '../../helpers/groupDataHelpers';
import { getContextIdPathFromIndex, saveContextId } from '../../helpers/contextIdHelpers';
import {
  loadSelections,
  loadComments,
  loadBookmarks,
  loadInvalidated,
} from '../../helpers/checkDataHelpers';
import {
  getGroupsIndex,
  getGroupsData,
} from '../../selectors';
import {
  CHANGE_CONTEXT_ID,
  CHANGE_SELECTIONS,
  SET_BOOKMARK,
  SET_INVALIDATED,
  ADD_COMMENT,
} from './actionTypes';

/**
 * Loads the latest contextId file from the file system.
 * @param {string} toolName - tool's name.
 * @param {string} bookId - book id code. e.g. tit.
 * @param {string} projectSaveLocation - project's absolute path.
 * @param {object} toolsSelectedGLs - tools selected gls.
 * @param {object} bibles - bible resources.
 */
export function loadCurrentContextId(toolName, bookId, projectSaveLocation, toolsSelectedGLs, bibles) {
  return (dispatch, getState) => {
    const state = getState();
    const groupsIndex = getGroupsIndex(state);

    if (projectSaveLocation && toolName && bookId) {
      let contextId = {};

      try {
        let loadPath = getContextIdPathFromIndex(projectSaveLocation, toolName, bookId);

        if (fs.existsSync(loadPath)) {
          try {
            contextId = fs.readJsonSync(loadPath);
            const contextIdExistInGroups = groupsIndex.filter(({ id }) => id === contextId.groupId).length > 0;

            if (contextId && contextIdExistInGroups) {
              return dispatch(changeCurrentContextId(contextId, toolName, projectSaveLocation, toolsSelectedGLs, bibles));
            }
          } catch (err) {
            // The object is undefined because the file wasn't found in the directory
            console.warn('loadCurrentContextId() error reading contextId', err);
          }
        }
        // if we could not read contextId default to first
        contextId = firstContextId(state);
        dispatch(changeCurrentContextId(contextId, toolName, projectSaveLocation, toolsSelectedGLs, bibles));
      } catch (err) {
        // The object is undefined because the file wasn't found in the directory or other error
        console.warn('loadCurrentContextId() error loading contextId', err);
      }
    } else {
      console.warn('projectSaveLocation || toolName || bookId is undefined');
    }
  };
}

/**
 * @description this action changes the contextId to the current check.
 * @param {object} contextId - the contextId object.
 * @param {string} toolName - tool's name.
 * @param {string} projectSaveLocation - project's absolute path.
 * @param {object} toolsSelectedGLs - tools selected gls.
 * @param {object} bibles - bible resources.
 * @return {object} New state for contextId reducer.
 */
export const changeCurrentContextId = (contextId, toolName, projectSaveLocation, toolsSelectedGLs, bibles) => (dispatch, getState) => {
  const state = getState();
  const groupDataLoaded = changeContextIdInReducers(contextId, dispatch, state);

  if (contextId) {
    const {
      reference: {
        bookId,
        chapter,
        verse,
      },
      tool,
      groupId,
    } = contextId;
    const refStr = `${tool} ${groupId} ${bookId} ${chapter}:${verse}`;
    console.log(`changeCurrentContextId() - setting new contextId to: ${refStr}`);

    if (!groupDataLoaded) { // if group data not found, load from file
      dispatch(loadCheckData(contextId, toolName, projectSaveLocation, toolsSelectedGLs, bibles));
    }
    saveContextId(state, contextId);

    // commit project changes after delay
    delay(5000).then(async () => {
      try {
        const repo = await Repo.open(projectSaveLocation, state.loginReducer.userdata);
        const saveStarted = await repo.saveDebounced(`Auto saving at ${refStr}`);

        if (!saveStarted) {
          console.log(`changeCurrentContextId() - GIT Save already running, skipping save after ${refStr}`);
        }
      } catch (e) {
        console.error(`changeCurrentContextId() - Failed to auto save ${refStr}`, e);
      }
    });
  }
};

/**
 * @description this action changes the contextId to the first check.
 * @return {object} New state for contextId reducer.
 */
function firstContextId(state) {
  let contextId;
  const groupsIndex = getGroupsIndex(state);
  const groupsData = getGroupsData(state);
  let groupsIndexEmpty = groupsIndex.length === 0;
  let groupsDataEmpty = Object.keys(groupsData).length === 0;

  if (!groupsIndexEmpty && !groupsDataEmpty) {
    let valid = false, i = 0;

    while (!valid && i < groupsIndex.length - 1 || i === 0) {
      let groupId = groupsIndex[i].id;
      let data = groupsData[groupId];

      if (!!data && !!data[0]) {
        contextId = data[0].contextId;
      }
      valid = !!contextId;
      i++;
    }
    return contextId;
  }
}

/**
 * change context ID and load check data in reducers from group data reducer
 * @param {Object} contextId
 * @param {Function} dispatch
 * @param {Object} state
 * @return {Boolean} true if check data found in reducers
 */
function changeContextIdInReducers(contextId, dispatch, state) {
  let oldGroupObject = {};
  const groupsData = getGroupsData(state);

  if (contextId && contextId.groupId) {
    const currentGroupData = groupsData && groupsData[contextId.groupId];

    if (currentGroupData) {
      const index = findGroupDataItem(contextId, currentGroupData);
      oldGroupObject = (index >= 0) ? currentGroupData[index] : null;
    }
  }

  // if check data not found in group data reducer, set to defaults
  const selections = oldGroupObject['selections'] || [];
  const nothingToSelect = oldGroupObject['nothingToSelect'] || false;
  const reminders = oldGroupObject['reminders'] || false;
  const invalidated = oldGroupObject['invalidated'] || false;
  const comments = oldGroupObject['comments'] || '';
  const actionsBatch = [
    {
      type: CHANGE_CONTEXT_ID,
      contextId,
    },
    {
      type: CHANGE_SELECTIONS,
      modifiedTimestamp: null,
      selections,
      nothingToSelect,
      username: null,
    },
    {
      type: SET_BOOKMARK,
      enabled: reminders,
      modifiedTimestamp: '',
      userName: '',
      gatewayLanguageCode: null,
      gatewayLanguageQuote: null,
    },
    {
      type: SET_INVALIDATED,
      enabled: invalidated,
      modifiedTimestamp: '',
      userName: '',
      gatewayLanguageCode: null,
      gatewayLanguageQuote: null,
    },
    {
      type: ADD_COMMENT,
      modifiedTimestamp: '',
      text: comments,
      userName: '',
    },
  ];
  dispatch(batchActions(actionsBatch)); // process the batch
  return !!oldGroupObject;
}

export const changeContextId = contextId => ({
  type: CHANGE_CONTEXT_ID,
  contextId,
});

const loadCheckData = (contextId, toolName, projectSaveLocation, toolsSelectedGLs, bibles) => dispatch => {
  const actionsBatch = [];
  actionsBatch.push(loadSelections(projectSaveLocation, contextId));
  actionsBatch.push(loadComments(projectSaveLocation, contextId));
  actionsBatch.push(loadBookmarks(projectSaveLocation, contextId, toolName, toolsSelectedGLs, bibles));
  actionsBatch.push(loadInvalidated(projectSaveLocation, contextId, toolName, toolsSelectedGLs, bibles));
  dispatch(batchActions(actionsBatch)); // process the batch
};
