/**
 * Created by jiajunhe on 2016/12/22.
 */


export default function SearchResultList (props) {
	console.log('渲染组件 SearchResultList');
	return (
		<div id="searchResultList">
			<div onClick={props.onClearResult}>返回</div>

			<span>
				搜索:
				<p id="searchWord">{props.searchWord}</p>
				, 共
				<em id="resultLen">{props.singerList.length}</em>
				条记录
			</span>

			<ul id="list1">
				{props.singerList && props.singerList.map((item) => (
					<li
						key={item.singerid}
						onClick={props.onSelectSinger.bind({},item.singerid)}>
						<span className="ran">{item.index}</span>
						{ item.singername } ( { item.areaname } )
					</li>
				))}
			</ul>
		</div>
	)
}