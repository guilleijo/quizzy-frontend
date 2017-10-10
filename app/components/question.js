import React from 'react';
import Answer from './answer';
import { connect } from 'react-redux';
import { changeQuestionName, changeQuestionDifficulty, changeHintQuestion, addOrRemoveQuestionAnswer } from '../redux/actions/game';
import '../stylesheets/question.scss';
import { Row, Col, Form, FormGroup, FormControl, Button,
  Glyphicon, FieldGroup, ControlLabel, InputGroup } from 'react-bootstrap';
import { Icon } from 'react-fa';
  

const mapDispatchToProps = (dispatch) => {
    return {
      changeQuestionName: (newQuestion, index) => dispatch(changeQuestionName(newQuestion, index)),
      changeQuestionDifficulty: (newDifficulty, index) => dispatch(changeQuestionDifficulty(newDifficulty, index)),
      changeHintQuestion: (newHint, index) => dispatch(changeHintQuestion(newHint, index)),
      addOrRemoveQuestionAnswer: (answers, index) => dispatch(addOrRemoveQuestionAnswer(answers, index)),      
    };
};

const mapStateToProps = (state,props) => {
    return {
      self: state.gameData.questions[props.id]
    };
};

class Question extends React.PureComponent {
  constructor(props){
    super(props);
    this.changeQuestion = this.changeQuestion.bind(this);
    this.changeDifficulty = this.changeDifficulty.bind(this);
    this.changeHint = this.changeHint.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.removeAnswer = this.removeAnswer.bind(this);
  }

  changeQuestion(event) {
    this.props.changeQuestionName(event.target.value, this.props.id);
  }

  changeHint(event){
    this.props.changeHintQuestion(event.target.value, this.props.id);
  }

  changeDifficulty (event) {
    this.props.changeQuestionDifficulty(event.target.value, this.props.id);
  }

  addAnswer() {
    if (this.props.obj.answers.length < 6) {
      this.props.obj.answers.push({ 'answer': '' });
      this.props.addOrRemoveQuestionAnswer(this.props.obj.answers, this.props.id);      
    } else {
      alert("The question can't have more than six answers");
    }
  }

  removeAnswer(index) {
    if (this.props.obj.answers.length > 2) {
      this.props.obj.answers.splice(index, 1);
      this.props.addOrRemoveQuestionAnswer(this.props.obj.answers, this.props.id);
    } else {
      alert('The question must have at least two answers');
    }
  }

  render() {
    const question = this.props.self;
    const hint = this.props.id;
    const id = this.props.id;
    const answers = [];
    question.answers.forEach( (answer, index) => {
      answers.push(
        <Answer
          key={ index }
          id={ index }
          text={ answer.answer }
          correct={ question.correctAnswer == index }
          question={ id }
          removeAnswer={ this.removeAnswer }
        />
      );
    });

    return (
      <div className='question'>
        <FormGroup>
          <InputGroup>
          <FormControl
            type='text'
            onChange={ this.changeQuestion }
            value={ question.text }
            placeholder={ 'Question text' }
          /> {' '}
          <InputGroup.Addon>
            ?
          </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Hint (optional):</ControlLabel>
          <InputGroup>
            <FormControl
              type='text'
              onChange={ this.changeHint }
              value={ question.hint }
              placeholder={ 'Question hint' }
            /> {' '}
            <InputGroup.Addon>
              <Icon name='lightbulb-o'/> 
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Difficulty:</ControlLabel>
          <FormControl componentClass='select' onChange={ this.changeDifficulty }
          value={ this.props.self.difficulty }>
            <option value='Easy'>Easy</option>
            <option value='Medium'>Medium</option>
            <option value='Hard'>Hard</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Answers:</ControlLabel>
            { answers }
        </FormGroup>
        <div>
          <a id="arAnswer" onClick={ this.addAnswer }>Add answer</a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question);
