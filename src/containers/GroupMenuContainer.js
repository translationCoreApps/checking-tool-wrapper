import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GroupMenu from '../components/GroupMenuWrapper';
// actions
import { loadGroupsIndex } from '../state/actions/groupsIndexActions';
import { loadGroupsData } from '../state/actions/groupsDataActions';

function GroupMenuContainer(props) {
  useEffect(() => {
    props.loadGroupsIndex();
  });

  return <GroupMenu {...props} />;
}

GroupMenuContainer.propTypes = {
  translate: PropTypes.func.isRequired,
  groupsIndex: PropTypes.array.isRequired,
  groupsData: PropTypes.object.isRequired,
  loadGroupsIndex: PropTypes.func.isRequired,
  loadGroupsData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  // TODO: Add selectors
  groupsDataReducer: state.groupsDataReducer,
  groupsIndexReducer: state.groupsIndexReducer,
});

const mapDispatchToProps = {
  loadGroupsIndex,
  loadGroupsData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupMenuContainer);

