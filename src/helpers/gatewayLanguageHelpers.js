/* eslint-disable no-nested-ternary */
import { getAlignedText } from 'tc-ui-toolkit';

/**
 * Returns the gateway langauge code and quote.
 * @param {string} toolName - tools name.
 * @param {object} contextId - context id.
 * @param {string} gatewayLanguageCode - gateway language code.
 * @param {object} toolsSelectedGLs - list of gls selected for tools.
 * @param {object} bibles - bible resources.
 * @return {{gatewayLanguageCode: *, gatewayLanguageQuote: *}}
 */
export const getGatewayLanguageCodeAndQuote = (toolName, contextId, gatewayLanguageCode, toolsSelectedGLs, bibles) => {
  const gatewayLanguageQuote = getAlignedGLText(
    toolsSelectedGLs,
    contextId,
    bibles,
    toolName,
  );

  return {
    gatewayLanguageCode,
    gatewayLanguageQuote,
  };
};

/**
 * get the selected text from the GL resource for this context
 * @param {*} toolsSelectedGLs
 * @param {*} contextId
 * @param {*} bibles - list of resources
 * @param {*} currentToolName - such as translationWords
 */
export function getAlignedGLText(toolsSelectedGLs, contextId, bibles, currentToolName) {
  const selectedGL = toolsSelectedGLs[currentToolName];

  if (!contextId.quote || !bibles || !bibles[selectedGL] || !Object.keys(bibles[selectedGL]).length) {
    return contextId.quote;
  }

  const sortedBibleIds = Object.keys(bibles[selectedGL]).sort(bibleIdSort);

  for (let i = 0; i < sortedBibleIds.length; ++i) {
    const bible = bibles[selectedGL][sortedBibleIds[i]];
    const alignedText = getAlignedTextFromBible(contextId, bible);

    if (alignedText) {
      return alignedText;
    }
  }
  return contextId.quote;
}

/**
 * Return book code with highest precidence
 * @param {*} a - First book code of 2
 * @param {*} b - second book code
 */
export function bibleIdSort(a, b) {
  const biblePrecedence = ['udb', 'ust', 'ulb', 'ult', 'irv']; // these should come first in this order if more than one aligned Bible, from least to greatest

  if (biblePrecedence.indexOf(a) == biblePrecedence.indexOf(b)) {
    return (a < b ? -1 : a > b ? 1 : 0);
  } else {
    return biblePrecedence.indexOf(b) - biblePrecedence.indexOf(a);
  } // this plays off the fact other Bible IDs will be -1
}

/**
 * Gets the aligned GL text from the given bible
 * @param {object} contextId
 * @param {object} bible
 * @returns {string}
 */
export function getAlignedTextFromBible(contextId, bible) {
  if (bible && contextId && contextId.reference &&
    bible[contextId.reference.chapter] && bible[contextId.reference.chapter][contextId.reference.verse] &&
    bible[contextId.reference.chapter][contextId.reference.verse].verseObjects) {
    const verseObjects = bible[contextId.reference.chapter][contextId.reference.verse].verseObjects;
    return getAlignedText(verseObjects, contextId.quote, contextId.occurrence);
  }
}