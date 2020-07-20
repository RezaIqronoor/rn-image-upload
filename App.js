import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'

const App = () => {

  const [ImageData, setImageData] = useState({})

  useEffect(() => { }, [ImageData])

  pickImage = () => {

    console.log('response')

    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setImageData({
          source,
          data: {
            fileName: response.fileName,
            type: response.type,
            uri: response.uri
          }
        })
      }
    });
  }

  uploadImageToServer = () => {
    RNFetchBlob.fetch('POST', 'http://192.168.100.100:4000/image/upload/', {
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'image', filename: ImageData.data.fileName, type: ImageData.data.type, data: RNFetchBlob.wrap(ImageData.data.uri) }
    ]).then((resp) => {
      console.log(resp.text());
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <View style={s.container}>
      {/* <TouchableOpacity onPress={() => {
        ImageData != {} ? pickImage() : uploadImageToServer()
      }}>
        <Text style={s.title}>{ImageData != {} ? 'Pick Image' : 'Upload Image'}</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => {
        pickImage()
      }}>
        <Text style={s.title}>Pick Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        uploadImageToServer()
      }}>
        <Text style={s.title}>Upload Image</Text>
      </TouchableOpacity>
      <Image style={s.image} source={ImageData.source} />
      <Text style={s.subTitle}>file: {JSON.stringify(ImageData.source)}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 20
  },
  subTitle: {
    fontSize: 14,
    color: 'lightgrey',
    textAlign: 'center'
  }
})

export default App