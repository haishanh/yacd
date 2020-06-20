import { getSearchText, updateSearchText } from '../store/rules';
import Search from './Search';
import { connect } from './StateProvider';

const mapState = (s) => ({ searchText: getSearchText(s), updateSearchText });
export default connect(mapState)(Search);
