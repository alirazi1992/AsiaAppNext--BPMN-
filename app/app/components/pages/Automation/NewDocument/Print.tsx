// import React, { useRef } from 'react'
// import { ReactToPrint } from 'react-to-print';

// const Print = (props: any) => {
//     const iframeRef = useRef(null);
//     return (
//         <div>
//             <ReactToPrint
//                 content={() => iframeRef.current}
//             />
//             <style type="text/css" media="print">
//                 {
//                     "\
//    @page { size: landscape; }\
// "
//                 }
//             </style>
//             <iframe src={'data:application/pdf;base64,' + props.props} className='w-full h-[90vh]' ref={iframeRef} ></iframe>
//         </div>
//     )
// }

// export default Print