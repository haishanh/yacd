import { getSearchText, updateSearchText } from '$src/store/logs';
import { State } from '$src/store/types';

import Search from './Search';
import { connect } from './StateProvider';

const mapState = (s: State) => ({ searchText: getSearchText(s), updateSearchText });
export default connect(mapState)(Search);
