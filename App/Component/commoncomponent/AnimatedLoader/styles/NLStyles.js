const bgColor = '#dedede';
const layoutTextbgColor = '#f5f5f5';
const NLStyles = {
    container: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'column', 
      },
    dataView: {
        width: '95%',
        height: '10%',
        backgroundColor: bgColor,
        borderRadius: 10,
        alignItems:'center',
        flexDirection:'row',
        marginBottom:10
    },
    circleView:{
        width:50,
        height:50, 
        borderRadius:50/2,
        backgroundColor:'#f5f5f5',
        marginLeft:10
    },
    parentTextView:{
        flexDirection:'column', 
        width: '95%', 
        height: '10%',
        justifyContent:'center'
    },
    BigText: {
        width: '70%',
        height: 12,
        borderRadius: 8,
        backgroundColor: layoutTextbgColor,
        marginTop: 0,
        marginLeft: 10
      },
    SmallText: {
        width: '50%',
        height: 12,
        borderRadius: 10,
        backgroundColor: layoutTextbgColor,
        marginTop: 10,
        marginLeft: 10
    },

};

export default NLStyles;