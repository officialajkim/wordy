import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class MongoReview extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      wordsNow: [],
      index: 0,
      howMany: 5
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleClickNextIndex = this.handleClickNextIndex.bind(this);
    this.handleClickRefresh = this.handleClickRefresh.bind(this);
  }

  componentDidMount() {
    // Load data
    fetch('/mongoApi/words', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => {
      this.setState({words: result}, () => {
        this.setState({
          wordsNow: this.state.words.slice(this.state.index, this.state.index + this.state.howMany)
  
        })
      })
    })    
  }

  handleClickRefresh() {
    fetch('/mongoApi/logs/lastLog', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => {
        const foundIndex = this.state.words.findIndex(element => element._id === result.wordId)
        console.log(this.state.words); // Test
        console.log(result); // Test
        console.log(foundIndex); // Test
      this.setState({
        // First
        index: foundIndex
      }, () => {
        // Then
        this.setState({
          wordsNow: this.state.words.slice(this.state.index, this.state.index + this.state.howMany)
        })
      })
    })
  }

  handleClickNextIndex() {
    const newIndex = this.state.index + this.state.howMany;
    this.setState({
      index: newIndex
    }, () => {
      this.setState({
        wordsNow: this.state.words.slice(newIndex, newIndex + this.state.howMany)
      })
    })

    //Check if it reached the index
    if(this.state.words.length - this.state.howMany - 1 < newIndex){
      this.setState({
        index: 0,
        wordsNow: this.state.words.slice(0, this.state.howMany)
      })
    }
  }
  
  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header><Button variant="outline-warning" onClick={this.handleClickRefresh}>Refresh</Button></Card.Header>
          <Card.Body>
            <Card.Title>2020-2 English</Card.Title>
            {this.state.wordsNow.map(element => {
              return <Card key={element._id} body bg="light">{element.word} [{element.pronunciation}] {element.definition} = {element.exampleSentence}</Card>
            })}
            <Button variant="primary" onClick={this.handleClickNextIndex}>Next</Button>
          </Card.Body>
          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}

export default MongoReview;