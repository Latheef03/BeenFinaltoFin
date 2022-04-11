import { deviceWidth, deviceHeight } from '../Component/_utils/CommonUtils'
const styles = {
    viewParentContainer: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        flex: 1,
        flexDirection: 'column'
    },
    viewParentImageContainer: {
        height: deviceHeight * 0.70,
        alignItems: "center",
    },
    viewImageContainer: {
        width:deviceWidth,
        height: deviceHeight * 0.70,
        marginTop: 10,
        paddingLeft: 24,
        paddingRight: 24,
    },
    imageBinding: { 
        width:deviceWidth,
        height: deviceHeight * 0.70,
        borderRadius: 1 
    },
    viewFiltersContainer: {
        height: deviceHeight * 0.30,
        alignItems: "center",
    }
}
export default styles;