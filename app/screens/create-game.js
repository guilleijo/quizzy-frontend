import React from 'react';
import '../stylesheets/create-game.scss';

import {
  addQuestion,
  changeCategory,
  changeDescription,
  changeImage,
  changeName,
  createGame,
  removeAllQuestions,
  removeQuestion
} from '../redux/actions/game';

import Questions from '../components/questions';
import Question from '../components/question';
import { connect } from 'react-redux';
import empty from '../../assets/images/empty.svg';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    description: state.gameData.description,
    image: state.gameData.image,
    name: state.gameData.name,
    category: state.gameData.category,
    questions: state.gameData.questions,
    error: state.gameData.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addQuestion: (question) => dispatch(addQuestion(question)),
    removeQuestion: (question) => dispatch(removeQuestion(question)),
    removeAllQuestions: () => dispatch(removeAllQuestions()),
    changeImage: (image) => dispatch(changeImage(image)),
    changeDescription: (name) => dispatch(changeDescription(name)),
    changeName: (name) => dispatch(changeName(name)),
    changeCategory: (category) => dispatch(changeCategory(category)),
    createGame: (game,onSuccess) => dispatch(createGame(game,onSuccess))
  };
};

const question = () => {
  return {
    text: '',
    difficulty: 'Easy',
    answers: [ '','','','' ],
    correctAnswer: 0
  };
};

class CreateGame extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onAddQuestion = this.onAddQuestion.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onDone = this.onDone.bind(this);
    this.onSuccess = this.onSuccess.bind(this);

  }

  onDone() {
    const { name, description,
      category, questions , image} = this.props;
    const game = {
      creator: 'Fulane of such',
      name,
      description,
      tags: [ category ],
      questions,
      image
    };
    this.props.createGame(game,this.onSuccess);
  }

  onSuccess(){
    this.props.history.push('/');
  }

  componentWillMount() {
    // remove all questions

    this.props.removeAllQuestions();
    this.props.addQuestion(question());
  }

  componentWillUnmount() {
    // remove all questions
    this.props.removeAllQuestions();
  }

  onAddQuestion() {
    let indexWhereAdd = this.props.questions.length;
    this.props.addQuestion(question(indexWhereAdd));
  }

  onChangeImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => this.props.changeImage(reader.result);
  }
  onChangeDescription(event) {
    this.props.changeDescription(event.target.value);
  }
  onChangeName(event) {
    this.props.changeName(event.target.value);
  }

  onChangeCategory(event) {
    this.props.changeCategory(event.target.value);
  }

  test() {}
  
  render() {
    let questions = this.props.questions.map( (question, index) =>
      <Question key={ index } id={ index } obj={ question } test={ this.test.bind(this) } />);
    return (
      <div>
        <h2> MAKE UP YOUR OWN GAME </h2>
        Name 
        <input 
          type='text' name='name' value={ this.props.name || '' } 
          onChange={ this.onChangeName } placeholder='eg: Tennis Champions'
        /> 
        <br/>
        description <textarea value={ this.props.description } onChange={ this.onChangeDescription } placeholder="eg: You've just lost the game"/><br/>
        <label className='upload-image' htmlFor='uploadImage'>
          {/* use CSS to set image size */}
          <img src={ this.props.image === null ? empty : this.props.image } height="100" id="previewImage"/>
          <input hidden type='file' id='uploadImage' name='image' onChange={ this.onChangeImage }/>
        </label>
        <br/>
          <label> Choose an image! </label>
        <br/>
        Category
        <select onChange={ this.onChangeCategory }>
          <option value='sports'>Sports</option>
          <option value='tv'>Television</option>
          <option value='videogames'>Videogames</option>
        </select> <br/>
        Questions <br/>
        <Questions>
          { questions } 
        </Questions>
        <div className="error-message">{ this.props.error }</div>
        <button onClick={ this.onAddQuestion }>Add...</button> <br/>
        <button onClick={ this.onDone }>Done</button>  <button>Cancel</button> <br/>
      </div>
    )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(CreateGame));
