import { LOAD_GROUPS_DATA_FROM_FS, CLEAR_PREVIOUS_GROUPS_DATA } from '../actions/actionTypes';
import { loadProjectGroupData } from '../../helpers/groupDataHelpers';

/**
 * Loads all of a tool's group data from the project.
 * @param {string} toolName - the name of the tool who's helps will be loaded.
 * @param {string} projectDir - the absolute path to the project.
 */
export const loadGroupsData = (toolName, projectDir) => (dispatch) => {
  console.log('loadGroupsData()');
  const groupsData = loadProjectGroupData(toolName, projectDir);

  dispatch({
    type: LOAD_GROUPS_DATA_FROM_FS,
    groupsData,
  });
};

/**
 * Clears the GroupsDataReducer to its inital state.
 */
export const clearGroupsData = () => ({ type: CLEAR_PREVIOUS_GROUPS_DATA });
