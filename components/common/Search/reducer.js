/**
 * Created by jiajunhe on 2016/12/17.
 */
import {
	RECEIVE_IMAGINE_SINGER,
	FOCUS_MOVE,

	INPUT,
	CLEAR_UI,

} from './action';

export function singerDataReducer (data) {
	const result = data[0],
		dataList = result.data,
		hasSearchResult = result.status == 1 && result.total > 0 && Object.prototype.toString.call(dataList) === '[object Array]';
	if (hasSearchResult) {
		dataList.forEach(function (data) {
			data.singername = data.singername.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
		});
	}
	// console.log('处理后的歌手列表资料', data, dataList);
	return (hasSearchResult && dataList) || [];
}

export default function reducer (state, action) {
	const data = action.data;
	switch (action.type){
		case RECEIVE_IMAGINE_SINGER:
			return {
				imagineList: singerDataReducer(data),
				focusIndex: -1
			};
		case FOCUS_MOVE:
			switch (data){
				case 'up':
					let newFocusIndex;
					if(state.focusIndex >= 0){
						newFocusIndex = state.focusIndex - 1;
						return {
							focusIndex: newFocusIndex,
							inputValue: state.imagineList[(newFocusIndex == -1) ? 0: newFocusIndex].singername
						};
					}
					break;
				case 'down':
					const len = state.imagineList.length;
					if(state.focusIndex < (len -1)){
						newFocusIndex = state.focusIndex + 1;
						return {
							focusIndex: newFocusIndex,
							inputValue: state.imagineList[newFocusIndex].singername
						};
					}
					break;
			}
			break;
		case INPUT:
			const len = state.inputValue.length;
			let value = '';

			if(data =='deleteWord' && len){
				value = state.inputValue.slice(0, len - 1);
				if(value){
					return {inputValue: value};
				}else{
					return {inputValue: value, imagineList: []};
				}
			}else if(data !=='deleteWord'){
				value = state.inputValue + data;
				return {inputValue: value};
			}
			break;
		case CLEAR_UI:
			return {imagineList: [], focusIndex: -1, inputValue: ''};
		default:
			return false;
	}
}
