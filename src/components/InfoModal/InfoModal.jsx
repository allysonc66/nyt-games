import Modal from '../Modal';
import Cell from '../Cell';
import styles from './InfoModal.module.scss';

const InfoModal = ({ isOpen, onClose, gameName }) => {
  switch (gameName) {
    default:
      return (
        <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
          <h3>
            Guess the WORDLE in six tries. Each guess must be a valid five-letter
            word. Hit the enter button to submit. After each guess, the color of the
            tiles will change to show how close your guess was to the word.
          </h3>
          <div className={styles.row}>
            <Cell value="W" status="correct" isCompleted />
            <Cell value="E" />
            <Cell value="A" />
            <Cell value="R" />
            <Cell value="Y" />
          </div>
          <h3>The letter W is in the word and in the correct spot.</h3>
          <div className={styles.row}>
            <Cell value="P" />
            <Cell value="I" status="present" isCompleted />
            <Cell value="L" />
            <Cell value="L" />
            <Cell value="S" />
          </div>
          <h3>The letter I is in the word but in the wrong spot.</h3>
          <div className={styles.row}>
            <Cell value="V" />
            <Cell value="A" />
            <Cell value="G" />
            <Cell value="U" status="absent" isCompleted />
            <Cell value="E" />
          </div>
          <h3>The letter U is not in the word in any spot.</h3>
        </Modal>
      );
  case 'CONNECTIONS':
    return (
      <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
          <h3>
            Find groups of four items that share something in common. Find the groups 
            without making 4 mistakes! Select four items and tap 'Submit' to check if 
            your guess is correct. 
          </h3>
          <h3>Category Examples</h3>
          <h3>FISH: Bass, Flounder, Salmon, Trout</h3>
          <h3>FIRE ___: Ant, Drill, Island, Opal</h3>
          <h3>Categories will always be more specific than "5-LETTER-WORDS," "NAMES" or "VERBS."</h3>
          <h3>Each puzzle has exactly one solution. Watch out for words that seem to belong to multiple categories!</h3>
        </Modal>
    )
  case 'THE MINI':
    return (
      <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
          <h3>
            A mini 5x5 crossword puzzle. Fill in all the words in the puzzle to win!
          </h3>
        </Modal>
    )
  case 'STRANDS':
    return (
      <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
          <h3>
            Find theme words to fill the board
          </h3>
          <h3>These words stay highlighted in purple when found.</h3>
          <h3>Drag letters to create words</h3>
          <h3>Theme words fill the board entirely. No theme words overlap</h3>
        </Modal>
    )
  }
};

export default InfoModal;
