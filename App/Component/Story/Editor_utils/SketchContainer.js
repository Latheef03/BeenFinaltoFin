/** @Import_Modules */
import React,{Component} from 'react';
import { View,Text,StyleSheet,StatusBar,Image ,StatusBarIOS} from 'react-native';
import {deviceWidth as dw , deviceHeight as dh} from '../../_utils/CommonUtils';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

/**
  @Main_Component called @SketchContainer
  @The_Component includes third party library (- @RNSketchCanvas -)
  @The_Component was written by @MUFTHI :-)
*/
export default class SketchContainer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      user: 0,
      drawPath: -1
    }
    // this.drawPath = -1
  }

   render(){
     const {isActive,savedimage,actionTools,clearSketchImage
      ,undoPaths} = this.props;
     const {user,drawPath} = this.state;
     console.log('the refs ==>',drawPath)
     return(
      isActive && (
        <View style={{width:dw,height:dh,...StyleSheet.absoluteFillObject,}}>
          <StatusBar hidden />
            <RNSketchCanvas
                  ref = {evs => this.RNSC = evs}
                  // localSourceImage={{ filename: imgWOfile, directory: null, mode: 'AspectFit' }}
                  containerStyle={{ backgroundColor: 'transparent', flex: 1,marginTop:StatusBar.currentHeight  }}
                  canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                  // containerStyle={{ backgroundColor: '#000', width: dw, height: dh }}
                  // canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                  // onStrokeStart = {data=>console.log('the start ==>',data)}
                  // onStrokeEnd={data => console.log('the stroke end ==> ',data)}
                  // onStrokeChanged = { data => console.log('the onstrokeChanged ==> ',data)}
                  strokeComponent={color => (
                    <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                  )}
                  strokeSelectedComponent={(color, index, changed) => {
                    return (
                      <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                    )
                  }}
                  strokeWidthComponent={(w) => {
                    return (<View style={styles.strokeWidthButton}>
                      <View style={{ backgroundColor: 'white', marginHorizontal: 2.5, width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2 }} />
                    </View>
                    )
                  }}
                  user = {`user${this.state.user}`}
                  // strokeColors = {colours}
                  defaultStrokeIndex={0}
                  defaultStrokeWidth={5}
                  closeComponent={<View style={styles.functionButton}><Image style={{width:20,height:20}} source={require('../../../Assets/Images/close_white.png')} /></View>}
                  onClosePressed = {()=>actionTools(undefined)}
                  undoComponent={<View style={styles.functionButton}><Text style={{ color: '#FFF' }}>Undo</Text></View>}
                  onUndoPressed = {()=> drawPath == 0 ? undoPaths() : null}
                  clearComponent={<View style={styles.functionButton}><Text style={{ color: '#FFF' }}>Clear</Text></View>}
                  onClearPressed = {()=>clearSketchImage()}
                  saveComponent={<View style={styles.functionButton}><Text style={{ color: '#FFF' }}>Done</Text></View>}
                  savePreference={() => { 
                    return { 
                      folder: 'Been/.drawedPics/', 
                      filename: String(Math.ceil(Math.random() * 100000000)), 
                      transparent: true, 
                      imageType: 'png' 
                    } }}
                  onSketchSaved={(success, path) => {
                    // if (this.state.imageSelectedIndex >= 0) {
                    //   let imagesChangedPath = this.state.imagesSelected
                    //   imagesChangedPath[this.state.imageSelectedIndex] = { ...imagesChangedPath[this.state.imageSelectedIndex], uri: "file:///" + path }
                    //   this.setState({ imagesSelected: imagesChangedPath })
                    // }
                    savedimage(path);
                    this.state.user = user + 1
                    this.state.drawPath = 0 
                    // actionTools(undefined)
                    // this.setState({ photoPath1: "file:///" + path, screenShot: path, example: null })
                  }}
                  onPathsChange={(pathsCount) => { 
                    // this.savePaths(pathsCount) 
                    this.setState({
                      drawPath : pathsCount
                    })
                    // this.drawPath = pathsCount
                    console.log('the paths',pathsCount);
                  }}
                />
            
        </View>
      ) 
     ) 
    }
}

const styles = {
    functionButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        height: 30,
        width: 60,
        backgroundColor: 'rgba(0,0,0,.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      },
      strokeWidthButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        width: 20,
        height: 20,
        borderRadius: 15,
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 12,
        alignItems: 'center',
        backgroundColor: '#ef1b66', 
        marginBottom: 10
      },
      strokeColorButton: {
        marginHorizontal: 2.5,
        marginVertical: 8,
        width: 25,
        height: 25,
        marginBottom:25,
        borderRadius: 5,
      },
}