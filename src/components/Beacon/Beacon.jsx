import React from "react"

import style from "./Beacon.module.css"

class Beacon extends React.Component {
    render() {
        return <div className={style.beacon_bg}>
                    <span className={style.beacon + " " + style[this.props.color]}></span>
                </div>;
    }
  }

export default Beacon