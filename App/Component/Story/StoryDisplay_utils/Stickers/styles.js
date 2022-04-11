import { StyleSheet } from 'react-native';

const stylesG = {
    mainView: {
        flex: 1,
      },
      box: {
        width: 300,
        height: 300,
        justifyContent: "center",
        alignSelf: "center",
        // backgroundColor: 'red',
        //margin: 0,
        zIndex: 200,
      },
      container: {
        ...StyleSheet.absoluteFillObject,
       // backgroundColor: '#000',
       // overflow: 'hidden',
       alignItems: 'center',
       flex: 1,
       justifyContent: 'center',
     },
};

export default stylesG;