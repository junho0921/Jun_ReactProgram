/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
/*action*/
import {setCurrentRankTag, getAllRecommendTag_toLoadSong} from '../../action/rank';
import {connect} from 'react-redux';

const RankClassList = ['HOT_RANK', 'GLOBAL_RANK', 'SPECIAL_RANK'];

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
		const dispatch = this.props.dispatch;
		// 在本tagList加载完毕后, 执行action
		// 获取运维提供的rankTag, 并以props.activeTagId加载rankTag的歌曲
		dispatch(getAllRecommendTag_toLoadSong(
			props.activeTagId,
			props.initialPageIndex
		));

		this.onSelectTag = (rank_id) => {dispatch(setCurrentRankTag(rank_id))};
	}
	shouldComponentUpdate(newProps){
		const pastProps = this.props;
		return (pastProps.activeTagId !== newProps.activeTagId ||
			pastProps.rankTags !== newProps.rankTags ||
			pastProps.rankClass !== newProps.rankClass);
	}
	render() {
		console.log('渲染组件 RankTag');
		const _this = this, props = this.props;
		const allRankClass = props.rankClass;
		const allRankTags = props.rankTags;
		const isActiveTag = (rank_id) => (rank_id == props.activeTagId);
		return (
			<div className="side">
				{RankClassList.map(function (rankClass) {
					const rankTagList = allRankClass[rankClass];
					return rankTagList && rankTagList.length && (
						<ul className="rank_nav" key={rankClass}>
							{rankTagList.map(function (rankId) {
								const tagData = allRankTags[rankId];
								return tagData && (
									<Tag
										tagName = 		{tagData.rank_name}
										icon = 			{tagData.icon}
										className = 	{isActiveTag(tagData.rank_id)&&'active'}
										key = 			{tagData.rank_id}
										onSelectTag = 	{!isActiveTag(tagData.rank_id)&&_this.onSelectTag.bind(_this, tagData.rank_id)} />
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

