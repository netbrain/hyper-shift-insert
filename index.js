const { clipboard } = require('electron');

const isDarwin = process.platform === 'darwin'

const isPasting = e => {  
  if(e.keyCode === 45 && e.shiftKey){
    return true;
  }
  if (isDarwin) {
    return (e.keyCode === 86 && e.metaKey);
  }
  return (e.keyCode === 86 && e.ctrlKey);
};

exports.decorateTerm = (Term, { React }) => {
  return class extends React.Component {
    constructor (props, context) {
      super(props, context);
      this._onTerminal = this._onTerminal.bind(this);
    }

    _onTerminal (term) {
      if (this.props && this.props.onTerminal) this.props.onTerminal(term);

      term.uninstallKeyboard();

      const shiftInsertHandler = [ 'keydown', (e) => {
        const terminal = term.keyboard.terminal;

        if (isPasting(e)) {
          terminal.io.sendString(clipboard.readText());
          e.preventDefault();
        }
      } ];

      term.keyboard.handlers_ = [ shiftInsertHandler ].concat(term.keyboard.handlers_);

      term.installKeyboard();
    }

    render () {
      return React.createElement(Term, Object.assign({}, this.props, {
        onTerminal: this._onTerminal
      }))
    }
  }
}
