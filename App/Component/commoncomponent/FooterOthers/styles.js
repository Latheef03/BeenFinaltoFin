import {Common_Color} from '../../../Assets/Colors'


const style = {
    
    mainviewStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    bottom:0,
    backgroundColor:'#fff',
    flexDirection:'row',
    height:70,
    marginTop:0,
    alignItems:'center',
    justifyContent:'center'
  },
  bottomButtons: {
    alignItems:'center',
    justifyContent: 'center',
    marginBottom:8,
    flex:1,
  },
  footerText: {
    // fontFamily:Common_Color.fontMedium,
    fontFamily:Common_Color.fontLight,
    alignItems:'center',
    // fontSize:14,
    fontSize:9
  },
  textStyle: {
    alignSelf: 'center',
    color: 'orange'
  },
  scrollViewStyle: {
    borderWidth: 2,
    borderColor: 'blue'
  }
 
}

  export default style;