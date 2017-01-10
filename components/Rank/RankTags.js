/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
/*action*/
import {connect} from 'react-redux';
import {_rankListRequest} from '../../utils/requestApi';

/*只关注文本内容或icon, 提供触发父级的onclick*/
const Tag = (props) => (
	<li
		className={props.className + ' tag'}
		onClick = {props.onSelectTag}>
		{props.icon && <img src={props.icon} />}
		<span title={props.tagName}>
			{props.tagName}
			</span>
	</li>);

class RankTagList extends React.Component {
	constructor(props){
		super(props);
	}
	shouldComponentUpdate(newProps){
		const pastProps = this.props;
		return (pastProps.activeTagId !== newProps.activeTagId ||
			pastProps.rankTags !== newProps.rankTags ||
			pastProps.rankClass !== newProps.rankClass);
	}
	render() {
		console.log('渲染组件 RankTag');
		const props = this.props,
			isActiveTag = (rank_id) => (rank_id == props.activeTagId);
		return (
			<div className="side">
				{_rankListRequest.list.map(function ({name}) {
					const rankTagList = props.rankClass[name];
					return rankTagList && rankTagList.length && (
						<ul className="rank_nav" key={name}>
							{rankTagList.map(function (rankId) {
								const tagData = props.rankTags[rankId];
								return tagData && (
									<Tag
										tagName = 		{tagData.rank_name}
										icon = 			{tagData.icon}
										className = 	{isActiveTag(tagData.rank_id)&&'active'}
										key = 			{tagData.rank_id}
										onSelectTag = 	{!isActiveTag(tagData.rank_id)&&props.onSelectTag.bind({}, tagData.rank_id)} />
									)
							})}
						</ul>)
				})}
			</div>);
	}
}

export default connect(
	(state) => {
		return {
			rankTags: state.Rank.rankTags,
			rankClass: state.Rank.rankClass
		}
	}
)(RankTagList);

