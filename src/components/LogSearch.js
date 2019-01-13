import Search from './Search';
import { getSearchText, updateSearchText } from 'd/logs';

const mapStateToProps = s => ({ searchText: getSearchText(s) });
const actions = { updateSearchText };

export default Search({ mapStateToProps, actions });
