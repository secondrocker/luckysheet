import React from 'react';
class Luckysheet extends React.Component {

  componentDidMount() {
      this.props.render()
  }
  render() {
      const luckyCss = {
          margin: '0px',
          padding: '0px',
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 80px)',
          left: '0px',
          top: '80px'
      }
      return (
          <div
          id="luckysheet"
          style={luckyCss}
          ></div>
      )
  }
}

export default Luckysheet
