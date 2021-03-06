/* eslint-env jest */
import * as checkAreaHelpers from '../src/helpers/checkAreaHelpers';
import { TRANSLATION_WORDS } from '../src/common/constants';


describe('checkAreaHelpers.getAlignedGLText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const verseObjects = [
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G14870',
      lemma: 'εἰ',
      morph: 'Gr,CS,,,,,,,,',
      occurrence: 1,
      occurrences: 1,
      content: 'εἴ',
      children: [
        {
          tag: 'zaln',
          type: 'milestone',
          strong: 'G51000',
          lemma: 'τις',
          morph: 'Gr,RI,,,,NMS,',
          occurrence: 1,
          occurrences: 1,
          content: 'τίς',
          children: [
            {
              text: 'An',
              tag: 'w',
              type: 'word',
              occurrence: 1,
              occurrences: 1,
            },
            {
              text: 'elder',
              tag: 'w',
              type: 'word',
              occurrence: 1,
              occurrences: 1,
            },
          ],
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G15100',
      lemma: 'εἰμί',
      morph: 'Gr,V,IPA3,,S,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἐστιν',
      children: [
        {
          text: 'must',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
        {
          text: 'be',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G04100',
      lemma: 'ἀνέγκλητος',
      morph: 'Gr,NP,,,,NMS,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἀνέγκλητος',
      children: [
        {
          text: 'without',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
        {
          text: 'blame',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      type: 'text',
      text: ',',
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G04350',
      lemma: 'ἀνήρ',
      morph: 'Gr,N,,,,,NMS,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἀνήρ',
      children: [
        {
          text: 'the',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
        {
          text: 'husband',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G15200',
      lemma: 'εἷς',
      morph: 'Gr,EN,,,,GFS,',
      occurrence: 1,
      occurrences: 1,
      content: 'μιᾶς',
      children: [
        {
          text: 'of',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 2,
        },
        {
          text: 'one',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G11350',
      lemma: 'γυνή',
      morph: 'Gr,N,,,,,GFS,',
      occurrence: 1,
      occurrences: 1,
      content: 'γυναικὸς',
      children: [
        {
          text: 'wife',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      type: 'text',
      text: ',',
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G21920',
      lemma: 'ἔχω',
      morph: 'Gr,V,PPA,NMS,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἔχων',
      children: [
        {
          text: 'with',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G41030',
      lemma: 'πιστός',
      morph: 'Gr,NS,,,,ANP,',
      occurrence: 1,
      occurrences: 1,
      content: 'πιστά',
      children: [
        {
          text: 'faithful',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G50430',
      lemma: 'τέκνον',
      morph: 'Gr,N,,,,,ANP,',
      occurrence: 1,
      occurrences: 1,
      content: 'τέκνα',
      children: [
        {
          text: 'children',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G33610',
      lemma: 'μή',
      morph: 'Gr,D,,,,,,,,,',
      occurrence: 1,
      occurrences: 1,
      content: 'μὴ',
      children: [
        {
          text: 'not',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G17220',
      lemma: 'ἐν',
      morph: 'Gr,P,,,,,D,,,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἐν',
      children: [
        {
          tag: 'zaln',
          type: 'milestone',
          strong: 'G27240',
          lemma: 'κατηγορία',
          morph: 'Gr,N,,,,,DFS,',
          occurrence: 1,
          occurrences: 1,
          content: 'κατηγορίᾳ',
          children: [
            {
              text: 'accused',
              tag: 'w',
              type: 'word',
              occurrence: 1,
              occurrences: 1,
            },
          ],
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G08100',
      lemma: 'ἀσωτία',
      morph: 'Gr,N,,,,,GFS,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἀσωτίας',
      children: [
        {
          text: 'of',
          tag: 'w',
          type: 'word',
          occurrence: 2,
          occurrences: 2,
        },
        {
          text: 'reckless',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
        {
          text: 'behavior',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G22280',
      lemma: 'ἤ',
      morph: 'Gr,CC,,,,,,,,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἢ',
      children: [
        {
          text: 'or',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      tag: 'zaln',
      type: 'milestone',
      strong: 'G05060',
      lemma: 'ἀνυπότακτος',
      morph: 'Gr,NP,,,,ANP,',
      occurrence: 1,
      occurrences: 1,
      content: 'ἀνυπότακτα',
      children: [
        {
          text: 'undisciplined',
          tag: 'w',
          type: 'word',
          occurrence: 1,
          occurrences: 1,
        },
      ],
    },
    {
      type: 'text',
      text: '. \n',
    },
  ];

  it('should return text from ult and NOT the ulb', () => {
    // given
    const toolsSelectedGLs = {
      translationWords: 'en',
      currentToolName: TRANSLATION_WORDS,
    };
    const contextId = {
      groupId: 'blameless',
      occurrence: 1,
      quote: 'ἀνέγκλητος',
      reference: {
        bookId: 'tit',
        chapter: 1,
        verse: 6,
      },
      strong: ['G04100'],
      tool: TRANSLATION_WORDS,
    };
    const bibles = {
      en: {
        'ult': { 1: { 6: { verseObjects: verseObjects } } },
        'ulb': [],
      },
    };
    const currentToolName = TRANSLATION_WORDS;
    const expectedAlignedGLText = 'without blame';

    // when
    const alignedGLText = checkAreaHelpers.getAlignedGLText(toolsSelectedGLs, contextId, bibles, currentToolName, k => k);

    // then
    expect(alignedGLText).toEqual(expectedAlignedGLText);
  });

  it('should return text from ulb', () => {
    // given
    const toolsSelectedGLs = {
      translationWords: 'en',
      currentToolName: TRANSLATION_WORDS,
    };
    const contextId = {
      groupId: 'blameless',
      occurrence: 1,
      quote: 'ἀνέγκλητος',
      reference: {
        bookId: 'tit',
        chapter: 1,
        verse: 6,
      },
      strong: ['G04100'],
      tool: TRANSLATION_WORDS,
    };
    const bibles = { en: { 'ulb': { 1: { 6: { verseObjects: verseObjects } } } } };
    const currentToolName = TRANSLATION_WORDS;
    const expectedAlignedGLText = 'without blame';

    // when
    const alignedGLText = checkAreaHelpers.getAlignedGLText(toolsSelectedGLs, contextId, bibles, currentToolName, k => k);

    // then
    expect(alignedGLText).toEqual(expectedAlignedGLText);
  });

  it('should return error message if original language quote string is not matched', () => {
    // given
    const toolsSelectedGLs = {
      translationWords: 'en',
      currentToolName: TRANSLATION_WORDS,
    };
    const contextId = {
      groupId: 'blameless',
      occurrence: 1,
      quote: 'ἀνέγκλητο',
      reference: {
        bookId: 'tit',
        chapter: 1,
        verse: 6,
      },
      strong: ['G04100'],
      tool: TRANSLATION_WORDS,
    };
    const bibles = {
      en: {
        'ult': { 1: { 6: { verseObjects: verseObjects } } },
        'ulb': [],
      },
    };
    const currentToolName = TRANSLATION_WORDS;
    const expectedAlignedGLText = null;

    // when
    const alignedGLText = checkAreaHelpers.getAlignedGLText(toolsSelectedGLs, contextId, bibles, currentToolName, k => k);

    // then
    expect(alignedGLText).toEqual(expectedAlignedGLText);
  });
});

describe('checkAreaHelpers.getInvalidQuoteMessage', () => {
  test('should give invalid quote message', () => {
    // given
    const contextId = {
      quote: [
        { word: 'εἰς', occurrence: 1 },
        { word: 'τὰς', occurrence: 1 },
        { word: '.', occurrence: 1 },
        { word: 'ἀναγκαίας', occurrence: 1 },
        { word: '-', occurence: 1 },
        { word: 'χρείας', occurrence: 1 },
        { word: ',', occurrence: 1 },
        { word: 'ἵνα', occurrence: 1 },
        { word: '...', occurrence: 1 },
        { word: 'μὴ', occurrence: 1 },
        { word: 'ὦσιν', occurrence: 1 },
        { word: '…', occurrence: 1 },
        { word: 'ἄκαρποι', occurrence: 1 },
        { word: '?', occurrence: 1 },
      ],
    };
    const expectedQuote = 'quote_invalid: εἰς τὰς. ἀναγκαίας - χρείας, ἵνα ... μὴ ὦσιν … ἄκαρποι?';

    // when
    const invalidQuote = checkAreaHelpers.getInvalidQuoteMessage(contextId, (t, p) => (t + ': ' + p.quote));

    // then
    expect(invalidQuote).toEqual(expectedQuote);
  });

  test('should handle null contextId', () => {
    // given
    const contextId = null;
    const expectedQuote = 'quote_invalid: ';

    // when
    const invalidQuote = checkAreaHelpers.getInvalidQuoteMessage(contextId, (t, p) => (t + ': ' + p.quote));

    // then
    expect(invalidQuote).toEqual(expectedQuote);
  });

  test('should handle missing contextId.quote', () => {
    // given
    const contextId = {};
    const expectedQuote = 'quote_invalid: ';

    // when
    const invalidQuote = checkAreaHelpers.getInvalidQuoteMessage(contextId, (t, p) => (t + ': ' + p.quote));

    // then
    expect(invalidQuote).toEqual(expectedQuote);
  });
});

describe('checkAreaHelpers.getQuoteAsString', () => {
  test('should return a quote as a string when given an array with lots of punctuation', () => {
    const quote = [
      { word: 'εἰς', occurrence: 1 },
      { word: 'τὰς', occurrence: 1 },
      { word: '.', occurrence: 1 },
      { word: 'ἀναγκαίας', occurrence: 1 },
      { word: '-', occurence: 1 },
      { word: 'χρείας', occurrence: 1 },
      { word: ',', occurrence: 1 },
      { word: 'ἵνα', occurrence: 1 },
      { word: '...', occurrence: 1 },
      { word: 'μὴ', occurrence: 1 },
      { word: 'ὦσιν', occurrence: 1 },
      { word: '…', occurrence: 1 },
      { word: 'ἄκαρποι', occurrence: 1 },
      { word: '?', occurrence: 1 },
    ];
    const flatQuote = checkAreaHelpers.getQuoteAsString(quote);
    const expectedQuote = 'εἰς τὰς. ἀναγκαίας - χρείας, ἵνα ... μὴ ὦσιν … ἄκαρποι?';
    expect(flatQuote).toEqual(expectedQuote);
  });

  test('should return the same quote string if quote is a string', () => {
    const quote = 'ἄκαρποι';
    const flatQuote = checkAreaHelpers.getQuoteAsString(quote);
    expect(flatQuote).toEqual(quote);
  });
});

describe('checkAreayHelpers.bibleIdSort', () => {
  it('Test ordering of Bible IDs', () => {
    // given
    const bibleIds = ['asv', 'esv', 'ulb', 'ust', 'ult', 'udb', 'irv', 'aaa', 'zzz'];
    const expectedSortedBibleIds = ['irv', 'ult', 'ulb', 'ust', 'udb', 'aaa', 'asv', 'esv', 'zzz'];

    // when
    const sortedBibleIds = bibleIds.sort(checkAreaHelpers.bibleIdSort);

    // then
    expect(sortedBibleIds).toEqual(expectedSortedBibleIds);
  });
});
