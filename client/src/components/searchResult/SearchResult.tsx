import React, { Fragment, useEffect, useState } from 'react';
// Type
import { State, Word } from '../../types';
// Translation
import tr from './search_result.tr.json';
import trYearChip from '../../pages/list/year_chip.tr.json';
// Theme
import { listDark, listLight, buttonLight, buttonDark } from '../../theme';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Action
import { modifySupport } from '../../redux/actions/supportAction';
// Material UI
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LoadingFbStyle from '../loading_fbstyle/LoadingFbStyle';
import { Tooltip, IconButton } from '@material-ui/core';
// MUI Icon
import GoUpToTopPageIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Components
import WordCard from '../word_card/WordCard';
const ADDING_MORE_WORDS_AMOUNT = 50;
const DEFAULT_MORE_WORDS_AMOUNT = 50;
const SEARCH_BEGINS_TERM_IN_SEC = 0.2;
const enableWordSearch = true;
const enableMeaningSearch = true;
const enableExamplesearch = true;

const SearchResult: React.FC = () => {
  // Redux states
  const { support, words, language } = useSelector((state: State) => state);
  const ln = language;
  const [ isSearching, setSeraching ] = useState<boolean>(true); 
  const [ matchingWord, setMatchingWord ] = useState<Word[]>([]);
  const [ wordCardsMax, setWordCardsMax ] = useState<number>(DEFAULT_MORE_WORDS_AMOUNT);
  // Searching enabled
  const [ lastSearch , setLastSearch ] = useState<string>("");

  // Search Algorithm (Forntend)
  useEffect(() => {
    const searchingAlgorithm = () => {
      const searchedWord: Word[] = [];
      const regex = new RegExp(`.*${support.searchData}.*`);

      words.forEach(wordChunk => {
        for (const word of wordChunk) {
          let found = false;
          if (!found && enableWordSearch && regex.exec(word.word) !== null) found = true;
          if (!found && enableMeaningSearch && regex.exec(word.meaning) !== null) found = true;
          if (!found && enableExamplesearch && regex.exec(word.example) !== null) found = true;
          if (found) searchedWord.push(word);
        };
      }); 

      setMatchingWord(searchedWord);

      // Finally turn off
      setSeraching(false);
    };

    // Runs the searching, only when it is admited.
    if (support.searchingBegins) {
      setLastSearch(support.searchData)
      store.dispatch(modifySupport({ searchingBegins: false }, true));
      searchingAlgorithm();
    };
  }, [words, support.searchData, support.searchingBegins]);

  // Searching possible algoriuth 

  useEffect(() => {
    if (lastSearch !== support.searchData && !support.searchingBegins) {
      const interval = setInterval(() => {
        if (!support.searchingBegins) {
          store.dispatch(modifySupport({ searchingBegins: true }, true));
        }
        
      }, SEARCH_BEGINS_TERM_IN_SEC * 1000);
      return () => clearInterval(interval);
    }
  }, [lastSearch, support.searchData, support.searchingBegins]);

  const handleMoreClick = () => {
    setWordCardsMax(wordCardsMax + ADDING_MORE_WORDS_AMOUNT);
  };

  const RenderMoreButton = matchingWord.length > DEFAULT_MORE_WORDS_AMOUNT && (
    <Tooltip title={trYearChip.expandMore[ln]} placement="bottom">
      <IconButton className={"ShowMoreButton"} color="inherit" aria-label="more" onClick={() => handleMoreClick()}>
        <ExpandMoreIcon fontSize="small" style={{ color: support.isDarkMode ? buttonLight : buttonDark }} />
      </IconButton>
    </Tooltip>
  );

  const RenderSerachResult = matchingWord.length > 0
  ? (
    <Fragment>
      <Typography style={{ paddingTop: 10, fontSize: `15px` }}>
        {tr.thisIsTheResultOf[ln]}
        <b>{support.searchData}</b>
        {tr.thatWeFound[ln]}
      </Typography>
      <Typography style={{ paddingTop: 10 }}>
        {`${tr.found[ln]} ${matchingWord.length} ${tr.resultMeasurement[ln]}`}
      </Typography>
      <Grid style={{ margin: 8}}>
        { matchingWord.slice(0, wordCardsMax).map(word => <WordCard word={word} key={word._id} />) }
      </Grid>
      { wordCardsMax < matchingWord.length && RenderMoreButton }
      <Tooltip title={trYearChip.toTopOfPage[ln]} placement="bottom">
        <IconButton className={"GoToTopOfPage"} color="inherit" aria-label="more" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <GoUpToTopPageIcon fontSize="small" style={{ color: support.isDarkMode ? buttonLight : buttonDark }} />
        </IconButton>
      </Tooltip> 
    </Fragment>
  )
  : (
    <Typography component="div" style={{ backgroundColor: support.isDarkMode ? listDark : listLight, minHeight: '30vh' }}>
      {`${tr.yourSearch[ln]}`}<b>{`${support.searchData}`}</b>{`${tr.notFound[ln]}`}
    </Typography>
  );
  
  return (
    <Fragment>
      { isSearching === true && <LoadingFbStyle />}
      { isSearching === false && RenderSerachResult }
    </Fragment>
  )
};

export default SearchResult;