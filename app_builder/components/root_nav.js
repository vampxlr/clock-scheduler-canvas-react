import React , { Component } from 'react'



class Root_Nav extends Component {


    reset_all () {
        this.props.reset_all()
    }
    clear_log(){
        this.props.clear_log()
    }

    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Project Smart Scheduler</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li><a  onClick={this.reset_all.bind(this)} href="#">Reset</a></li>


                            <li><a onClick={this.clear_log.bind(this)} href="#">Clear Log</a></li>


                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="https://github.com/vampxlr/clock-scheduler-canvas-react">GitHub</a></li>
                            <li><a href="https://dribbble.com/shots/2134918-Smart-Scheduler-freebie">MockUp</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}





export default Root_Nav





