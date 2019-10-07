import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'deep-equal';
import { TranslationHelps } from 'tc-ui-toolkit';
// helpers
import * as tHelpsHelpers from '../helpers/tHelpsHelpers';

class TranslationHelpsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelpsModal: false,
      modalArticle: '',
      articleCategory: '',
    };

    this.toggleHelpsModal = this.toggleHelpsModal.bind(this);
    this.followTHelpsLink = this.followTHelpsLink.bind(this);
    window.followLink = this.followTHelpsLink;
  }

  componentDidMount() {
    console.log('THW didMount1', this.props.resourcesReducer);
    this.loadArticle(this.props);
    console.log('THW didMount2', this.props.resourcesReducer);
  }

  componentDidUpdate(prevProps) {
    const { contextIdReducer } = this.props || {};
    const prevContextIdReducer = prevProps.contextIdReducer;

    console.log('THW didUpdate1', this.props.resourcesReducer);

    if (this.getGroupId(contextIdReducer) !== this.getGroupId(prevContextIdReducer)) { // we only need to reload article when groupId changes
      this.loadArticle(this.props);
    }

    console.log('THW didUpdate2', this.props.resourcesReducer);

    if (!isEqual(contextIdReducer, prevContextIdReducer)) { // we need to scroll to top whenever contextId changes
      const page = document.getElementById('helpsbody');

      if (page) {
        page.scrollTop = 0;
      }
    }
  }

  /**
   * safely get groupId from contextIdReducer
   * @param {Object} contextIdReducer
   * @return {String}
   */
  getGroupId(contextIdReducer) {
    return contextIdReducer && contextIdReducer.contextId && contextIdReducer.contextId.groupId;
  }

  toggleHelpsModal() {
    console.log('THW toggleHelpsModal', !this.state.showHelpsModal);
    console.log('THW toggleHelpsModal', this.props.resourcesReducer);
    this.setState({
      showHelpsModal: !this.state.showHelpsModal,
      modalArticle: '',
    });
  }

  /**
   * Loads the resource article
   * @param props
   * @private
   */
  loadArticle(props) {
    const {
      contextIdReducer, toolsReducer, toolsSelectedGLs, actions,
    } = props;
    const contextId = contextIdReducer && contextIdReducer.contextId;

    console.log('THW loadArticle', props);

    if (contextId) {
      const articleId = contextId.groupId;
      const { currentToolName } = toolsReducer;
      const languageId = toolsSelectedGLs[currentToolName];
      actions.loadResourceArticle(currentToolName, articleId, languageId);
    }
  }

  followTHelpsLink(link) {
    console.log('THW IN FOLLOW BEGINNING:', this.props.resourcesReducer);
    let linkParts = link.split('/'); // link format: <lang>/<resource>/<category>/<article>

    const [lang, type, category, article] = linkParts;
    const resourceDir = tHelpsHelpers.getResourceDirByType(type);

    this.props.actions.loadResourceArticle(resourceDir, article, lang, category);
    console.log('THW IN FOLLOW:', this.props.resourcesReducer);
    const articleData = this.props.resourcesReducer.translationHelps[resourceDir][article];

    let newState;
    const showHelpsModal = true;
    const articleCategory = category;

    if (articleData) {
      newState = {
        showHelpsModal,
        articleCategory,
        modalArticle: articleData,
      };
    } else {
      newState = {
        showHelpsModal,
        articleCategory,
        modalArticle: 'Cannot find an article for ' + link,
      };
    }
    //todo: Shouldn't need to to set state and return state in the same function
    // Seems like an anti pattern
    this.setState(newState);
    return newState;
  }

  render() {
    const {
      toolsSelectedGLs,
      toolsReducer: { currentToolName },
      resourcesReducer,
      contextIdReducer: { contextId },
      showHelps,
      toggleHelps,
      translate,
    } = this.props;
    console.log('THW render', this.props.resourcesReducer);
    const languageId = toolsSelectedGLs[currentToolName];
    const currentFile = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId, currentToolName);
    const currentFileMarkdown = tHelpsHelpers.convertMarkdownLinks(currentFile, languageId);
    const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(this.state.modalArticle, languageId, this.state.articleCategory);
    return (
      <TranslationHelps
        translate={translate}
        article={currentFileMarkdown}
        modalArticle={tHelpsModalMarkdown}
        openExpandedHelpsModal={() => this.toggleHelpsModal()}
        isShowHelpsSidebar={showHelps}
        sidebarToggle={toggleHelps}
        isShowHelpsExpanded={this.state.showHelpsModal} />
    );
  }
}

TranslationHelpsWrapper.propTypes = {
  toolsSelectedGLs: PropTypes.object,
  translate: PropTypes.func,
  resourcesReducer: PropTypes.object,
  contextIdReducer: PropTypes.shape({ contextId: PropTypes.object.isRequired }),
  toolsReducer: PropTypes.object,
  actions: PropTypes.shape({ loadResourceArticle: PropTypes.func.isRequired }),
  showHelps: PropTypes.bool.isRequired,
  toggleHelps: PropTypes.func.isRequired,
};

export default TranslationHelpsWrapper;
