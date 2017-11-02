import React from 'react';
import {
  addQuestion,
  changeCategory,
  changeDescription,
  changeImage,
  changeName,
  createGame,
  removeAllData,
  removeQuestion
} from '../redux/actions/game';
import Questions from '../components/questions';
import Question from '../components/question';
import { connect } from 'react-redux';
import empty from '../../assets/images/empty.svg';
import { withRouter } from 'react-router-dom';
import '../stylesheets/create-game.scss';
import { Button, Alert } from 'react-bootstrap';
import GameGeneralInfo from '../components/game-general-info';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import Scroll from 'react-scroll';

const mapStateToProps = (state) => {
  return {
    description: state.gameData.description,
    image: state.gameData.image,
    name: state.gameData.name,
    category: state.gameData.category,
    questions: state.gameData.questions,
    error: state.gameData.error,
    hint: state.gameData.hint
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addQuestion: (question) => dispatch(addQuestion(question)),
    removeQuestion: (question) => dispatch(removeQuestion(question)),
    removeAllData: () => dispatch(removeAllData()),
    changeImage: (image) => dispatch(changeImage(image)),
    changeDescription: (name) => dispatch(changeDescription(name)),
    changeName: (name) => dispatch(changeName(name)),
    changeCategory: (category) => dispatch(changeCategory(category)),
    createGame: (game,onSuccess) => dispatch(createGame(game,onSuccess)),
    changeHint: (hint) => dispatch(changeHint(hint)),
  };
};

const question = () => {
  return {
    text: '',
    hint: '',
    difficulty: '',
    answers: [{ 'answer': '' }, { 'answer': '' }],
    correctAnswer: -1
  };
};

class CreateGame extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      alertMessage: '',
      alertVisible: false,
      disableButtons: false,
      validateField: false,
      nameMessage: ''
    };
    this.onAddQuestion = this.onAddQuestion.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onRemoveQuestion = this.onRemoveQuestion.bind(this);
    this.onDone = this.onDone.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.validateName = this.validateName.bind(this);
    this.enableStepButtons = this.enableStepButtons.bind(this);
    this.disableStepButtons = this.disableStepButtons.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  onDone() {
    const { name, description,
      category, questions , image } = this.props;
    const game = {
      creator: 'Fulane of such',
      name,
      description,
      tags: [ category ],
      questions,
      image
    };
    this.props.createGame(game, this.onSuccess);
  }

  onSuccess() {
    this.props.history.push('/create-match');
  }

  componentWillMount() {
    this.props.removeAllData();
  }

  onAddQuestion() {
    let indexWhereAdd = this.props.questions.length;
    this.props.addQuestion(question(indexWhereAdd));
  }

  onChangeImage(file, reader) {
    reader.readAsDataURL(file);
    reader.onloadend = (e) => this.props.changeImage(reader.result);
  }

  onChangeDescription(value) {
    this.props.changeDescription(value);
  }

  onChangeName(value) {
    this.props.changeName(value);
  }

  onChangeCategory(value) {
    this.props.changeCategory(value);
  }

  onRemoveQuestion(index) {
    this.props.removeQuestion(index);
  }

  nextStep() {
    if ((this.state.step == 2) && (this.props.questions.length == 0 )) {
      this.handleAlertShow('You must create at least one question.');
    } else {
      this.setState({ step: this.state.step + 1 });
    }
  }

  prevStep() {
    this.handleAlertDismiss();
    this.setState({ step: this.state.step - 1 });
  }

  goToStep(index) {
    if (this.state.disableButtons && index !== 2) {
      this.handleAlertShow('You must save or cancel your question before changing step.');
    } else {
      if (this.state.step === 1 && this.props.name === '') {
        this.validateName();
      } else if (index === 3 && this.props.questions.length === 0) {
        this.setState({ step: 2 });
        this.handleAlertShow('You must create at least one question.');
      } else {
        this.handleAlertDismiss();
        this.setState({ step: index });
      }
    }
  }

  enableStepButtons() {
    this.setState({ disableButtons: false })
  }

  disableStepButtons() {
    this.setState({ disableButtons: true })
  }

  validateName() {
    if (this.props.name === ''){
      this.setState({
        validateField: true,
        nameMessage: "The name of the game can't be empty"
      })
    } else {
      this.setState({
        validateField: false,
        nameMessage: ''
      })
      this.nextStep()
    }
  }

  scrollToTop() {
    Scroll.animateScroll.scrollToTop();
  }

  handleAlertDismiss() {
    this.setState({
      alertMessage: '',
      alertVisible: false
    })
  }

  handleAlertShow(message) {
    this.scrollToTop();
    this.setState({
      alertMessage: message,
      alertVisible: true
    })
  }

  showStep() {
    switch (this.state.step) {
      case 1:
        return (
          <div>
            <GameGeneralInfo
              gameData={ this.props }
              changeName={ this.onChangeName }
              changeDescription={ this.onChangeDescription }
              changeImage={ this.onChangeImage }
              changeCategory={ this.onChangeCategory }
              validateField={ this.state.validateField }
              nameMessage={ this.state.nameMessage }
            />
            <div className='button-container inverted'>
              <Button bsSize='large' bsStyle='success' onClick={ this.validateName }>Next</Button>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <div className='question-panel'>
              <div>
                {
                  this.state.alertVisible ?
                  <Alert bsStyle="danger" className='alert' onDismiss={ this.handleAlertDismiss }>
                    <p>{ this.state.alertMessage }</p>
                  </Alert> : null
                }
              </div>

              <Questions
                questions={ this.props.questions }
                editQuestion={ this.onEditQuestion }
                addQuestion={ this.onAddQuestion }
                removeQuestion={ this.onRemoveQuestion }
                showAlert={ this.handleAlertShow }
                hideAlert={ this.handleAlertDismiss }
                enableStepButtons={ this.enableStepButtons }
                disableStepButtons={ this.disableStepButtons }
              />
            </div>
            <div className='button-container'>
              <Button bsSize='large' disabled={ this.state.disableButtons } bsStyle='default' onClick={ this.prevStep }>Back</Button>
              <Button bsSize='large' disabled={ this.state.disableButtons } bsStyle='success' onClick={ this.nextStep }>Next</Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <div className='final-step'>
              <h3>All set!</h3>
              <h3>You can click <i><b>CREATE!</b></i> to save your game and advance to the match creation</h3>
              <h4>or <i>Back</i> if you want to review your game</h4>
            </div>
            <div className='error-message'>{ this.props.error }</div>
            <div className='button-container'>
              <Button bsSize='large' bsStyle='default' onClick={ this.prevStep.bind(this) }>Back</Button>
              <Button bsSize='large' bsStyle='success' onClick={ this.onDone }>CREATE!</Button>
            </div>
          </div>
        )
    }
  }

  render() {
    return (
      <div className='createGame'>
        <div className='bigContainer'>
          <div id='title'>
            <h1>Create your own game</h1>
          </div>

          <Steps current={ this.state.step - 1 } className='progress-step'>
            <Step title="General Information" onClick={ () => this.goToStep(1) } className='step'/>
            <Step title="Questions" onClick={ () => this.goToStep(2) } className='step'/>
            <Step title="Final step!" onClick={ () => this.goToStep(3) } className='step'/>
          </Steps>

          { this.showStep() }

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(CreateGame));
