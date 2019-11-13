import fs from 'fs-extra';
import path from 'path-extra';
import isEqual from 'deep-equal';

/**x
 * @description loads checkdata based on given contextId.
 * @param {String} loadPath - load path.
 * @param {object} contextId - groupData unique context Id.
 * @return {object} returns the object loaded from the file system.
 */
export function loadCheckData(loadPath, contextId) {
  let checkDataObject;

  if (loadPath && contextId && fs.existsSync(loadPath)) {
    let files = fs.readdirSync(loadPath);

    files = files.filter(file => // filter the filenames to only use .json
      path.extname(file) === '.json'
    );

    let sorted = files.sort().reverse(); // sort the files to put latest first
    const isQuoteArray = Array.isArray(contextId.quote);

    for (let i = 0, len = sorted.length; i < len; i++) {
      const file = sorted[i];

      // check each file for contextId
      try {
        let readPath = path.join(loadPath, file);
        let _checkDataObject = fs.readJsonSync(readPath);

        if (_checkDataObject && _checkDataObject.contextId &&
          _checkDataObject.contextId.groupId === contextId.groupId &&
          (isQuoteArray ? isEqual(_checkDataObject.contextId.quote, contextId.quote) : (_checkDataObject.contextId.quote === contextId.quote)) &&
          _checkDataObject.contextId.occurrence === contextId.occurrence) {
          checkDataObject = _checkDataObject; // return the first match since it is the latest modified one
          break;
        }
      } catch (err) {
        console.warn('File exists but could not be loaded \n', err);
      }
    }
  }
  /**
  * @description Will return undefined if checkDataObject was not populated
  * so that the load method returns and then dispatches an empty action object
  * to initialized the reducer.
  */
  return checkDataObject;
}
