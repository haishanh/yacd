import Search from './Search';
import { getSearchText, updateSearchText } from '../ducks/logs';

const mapStateToProps = s => ({ searchText: getSearchText(s) });
const actions = { updateSearchText };

export default Search({ mapStateToProps, actions });
