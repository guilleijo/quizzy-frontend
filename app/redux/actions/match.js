import matchService from '../../services/match'
import {
  SET_PLAYERS,
  CLEAR_MATCH_STATE,
  LOAD_CURRENT_MATCH,
  REMOVE_CURRENT_MATCH,
  REMOVE_MATCH,
  LOAD_MATCH_DATA,
  LOAD_MATCH_DATA_SUCCESS,
  LOAD_MATCH_DATA_FAILURE,
  MATCH_NAME_ERROR,
  ANSWER_QUESTION,
  NEXT_QUESTION,
  SET_CURRENT_MATCH,
  CREATING_MATCH,
  CREATE_MATCH_SUCCESS,
  CREATE_MATCH_FAILURE,
  UPDATE_MATCH,
  SET_PLAYER,
  TIMEOUT
} from '../constants/match';

export const loadCurrentMatch = (input) => {
  return {
    type: LOAD_CURRENT_MATCH,
    currentMatch: input,
  }
}

export const removeCurrentMatch = () => {
  return {
    type: REMOVE_CURRENT_MATCH,
  }
}

export const removeMatch = () => {
  return {
    type: REMOVE_MATCH,
  }
}

export const loadMatchData = () => ({
  type: LOAD_MATCH_DATA,
});

export const loadMatchDataSuccess = (match) => ({
  type: LOAD_MATCH_DATA_SUCCESS,
  match,
});

export const loadMatchDataFailure = () => ({
  type: LOAD_MATCH_DATA_FAILURE,
});

export const setCurrentMatch = (match) => ({
  type: SET_CURRENT_MATCH,
  match,
});

export const fetchMatch = (matchName) => {
  return (dispatch) => {
    dispatch(loadMatchData());
    matchService.retrieve(matchName)
      .then((res) => {
        dispatch(loadMatchDataSuccess(res.data.match))
      })
      .catch((err) => {
        dispatch(loadMatchDataFailure())
      });
  }
};

export const creatingMatch = () => {
  return {
    type: CREATING_MATCH,
  }
};

export const createMatchSuccess = () => {
  return {
    type: CREATE_MATCH_SUCCESS,
  }
};

export const createMatchFailure = (error) => {
  return {
    type: CREATE_MATCH_FAILURE,
    error
  }
};

export const clearMatchState = (error) => {
  return {
    type: CLEAR_MATCH_STATE,
  }
};

export const createMatch = (match, onSuccess) => {
  return (dispatch) => {
    dispatch(creatingMatch());
    matchService.create(match)
      .then((res) => {
        dispatch(createMatchSuccess());
        const newMatch = Object.assign({}, match, { id: res.data.match.id });
        onSuccess(newMatch);
      })
      .catch((error) => {
        dispatch(createMatchFailure(error.response.data.error))
      });
  }
};

export const receiveMessageRealTime = ({ data }) => {
  return (dispatch, getState) => {
    const currentMatch = getState().matchData.currentMatch;
    const player = getState().matchData.state.player;
    const ws = getState().wsData.ws;
    if (data === 'hola') {
      ws.send(JSON.stringify([
        currentMatch,
        player
      ]));
    } else {
      const messages= JSON.parse(data);
      let players = [];
      for (let i = 0; i < messages.length; i++) {
        if (messages[i][0] === currentMatch) {
          players.push(messages[i][1]);
        }
      }
      dispatch(setPlayers(players));
    }
  }
};

export const setPlayers = (players) => ({
  type: SET_PLAYERS,
  players
});

export const updateMatch = (match) => ({
  type: UPDATE_MATCH,
  match
});

export const setPlayer = (nickname) => ({
  type: SET_PLAYER,
  player: nickname
});

export const matchNameError = (msg) => ({
  type: MATCH_NAME_ERROR,
  msg
});

export const answerQuestion = (correct, answer) => ({
  type: ANSWER_QUESTION,
  correct,
  answer
});

export const timeout = () => ({
  type: TIMEOUT
});

export const nextQuestion = () => ({
  type: NEXT_QUESTION,
});
