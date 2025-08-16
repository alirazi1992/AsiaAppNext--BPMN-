

let Styles = (props: any) => {
    return `

         
          .JDBackground{
             background: transparent !important;
           }
          .JDatePicker {
              width: 300px;
              min-height: 210px;
              padding: 10px;
              position: absolute;
              border-radius: 5px;
               z-index: 1100;
              background : ${props.stateMode ? "#212e3a" : "#e5ded8"} !important; 
           }
        //        .JDatePicker {
        //       width: 300px;
        //       min-height: 210px;
        //       padding: 10px;
        //       position: fixed;
        //       border-radius: 5px;
        //       z-index: 1100;
        //       background : #eef2ff !important; 
        //    }
        //       @media (max-width: 768px) {
        //      .JDatePicker {
        //        min-height: 210px;
        //        width: 300px;
        //        padding: 10px;
        //        position:  absolute;
        //        top: calc(50% - 105px);
        //        left:calc(50% - 150px);
        //         z-index: 1100;
        //          background : #eef2ff !important; 
        //         }
        //       }



           .JDatePicker * {
            color : ${props.textColor} !important; 
           }
           .JDatePicker>:last-child{
              margin-top: 5px !important;
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
           }

            .JC-years{
              display: flex !important;
              justify-content: center !important;
            }
            .JC-years * {
              width: auto !important;
            }

          .days-titles div {
              width: 14.28%;
              display: inline-block;
              font-size: 14px;
              font-weight: 300;
              text-align: center;
          }
          .JDatePicker .JC-months {
              position: relative;
              display: inline-block;
              width: 100%;
          }
          .JDatePicker .monthPicker {
              position: absolute;
              right: -6px;
              width: 100%;
              background: #fff;
              text-align: center;
              padding: 5px;
              border-radius: 5px;
              top: 26px;
              box-shadow: 0px 0px 7px -2px #000;
              z-index: 1;
          }
          .JDatePicker .month-items:hover, .JDatePicker .month-items.selected {
              background: aliceblue;
              color : ${props.textColor} !important; 
          }
          .JDatePicker .month-items {
              width: 32.5%;
              float: right;
              text-align: center;
              cursor: pointer;
              padding: 4px 0px;
              border: 1px solid #ccc;
              font-size: 14px;
          }
          .JDatePicker .JC-months .prev,  .JDatePicker .JC-months .next{
              float: right;
              width: 20%;
              text-align: center;
              transform: rotate(180deg);
              cursor: pointer;
          }
          
          .JDatePicker .JC-months span:first-child{
              float: right;
              width: 15%;
          }
          .JDatePicker .JC-months .holder:last-child{
              float: right;
              width: 85%;
          }
          .days-titles {
           
            padding : 10px !important; 
            font-weight: 600 !important;
          }

          .monthPicker {
            background : ${props.stateMode ? "#1b2b39" : "#ded6ce"} !important; 
          }
          .monthPicker *{
            color : ${props.textColor} !important;
          }
          .month-items:hover{
            background : ${props.color} !important; 
            color : white !important;
          }
          .selected{
            background : ${props.stateMode ? "#1b2b39" : "#ded6ce"} !important; 
            color : ${props.color} !important;
          }
          .JDatePicker .JC-days {
            padding : 10px !important; 
              position: relative;
              display: inline-block;
              background : ${props.stateMode ? "#1b2b39" : "#ded6ce"} !important; 
          }
          .JDatePicker .JC-days .holder {
              line-height: 24px;
          }
          .JDatePicker .print-month {
              width: 60%;
              text-align: center;
              float: right;
              cursor: pointer;
          }
          .JDatePicker .day-items{
              width: 14.28%;
              float: right;
              text-align: center;
              cursor: pointer;
              //border-bottom: solid #fff 1px;
              //border-left: 1px solid #fff;
          }
          .JDatePicker .day-items:hover, .JDatePicker .day-items.selected {
              background: #fff;
          }
          .JC-months .holder{
            width : 100% !important; 

          }

          .JC-months .holder * {
            text-align: center !important;
            color : ${props.color} !important; 
          } 

           .JDatePicker .day-items:hover{
              color: white !important;
              background-color: ${props.color} !important;
              border: #3fac822c !important;
              box-sizing: content-box !important;
              border-radius: 5px !important;
           }
          .JDatePicker .JDheader .right, .JDatePicker .JDheader .left {
              display: inline-block;
              width: 50%;
          }
          .JDatePicker .JDheader select {
              width: 94%;
              border: none;
              border-bottom: 1px solid;
              padding: 0 20%;
          }
          .JDatePicker .JDheader .left{
              text-align: center;
          }
          .JDatePicker .JDheader .right .number {
              width: 70%;
              direction: ltr;
              text-align: center;
              display: inline-block;
              margin-right: 10px !important;
          }
          .JDatePicker .JDheader .right .number:hover {
              border: 1px solid #ccc;
              cursor: text !important;
          }
          .JDatePicker .JDheader .right input[type="tel"] {
              width: 40%;
              z-index: 2;
              direction: ltr;
              text-align: center;
              display: inline-block;
              top: 8px;
              position: absolute;
          }
          .JDatePicker .JC-tooltip {
              position: absolute;
              background: #d9d9d9;
              z-index: 1;
              padding: 0px 10px;
          }
          .JDatePicker button {
              border: none;
              color: white !important;
              font-size: 16px;
              margin: 0 10px;
              width: 40px;
              height: 26px;
              border-radius: 5px;
              background: ${props.color};

          }
        
          .jdtrp > div {
              display: initial;
              margin: 0 6px;
          }
          `;
};
export default Styles;
