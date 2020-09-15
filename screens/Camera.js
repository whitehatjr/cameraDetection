// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { Camera } from "expo-camera";
// import * as Permissions from "expo-permissions";
// import {
//   FontAwesome,
//   Ionicons,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
//
// import styles from "./styles";
//
// export default class CameraPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hasCameraPermission: null,
//     };
//     this.camera = null;
//   }
//   async componentDidMount() {
//     const camera = await Permissions.askAsync(Permissions.CAMERA);
//     const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
//     const hasCameraPermission =
//       camera.status === "granted" && audio.status === "granted";
//     this.setState({ hasCameraPermission });
//   }
//
//   uploadImage = async (url) => {
//     //creatig the form data
//     const fileToUpload =
//       "https://3qeqpr26caki16dnhd19sv6by6v-wpengine.netdna-ssl.com/wp-content/uploads/2019/02/sample_image.png";
//     const data = new FormData();
//     data.append("digit", fileToUpload);
//     let res = await fetch("https://5ffb373a1726.ngrok.io/predict-digit", {
//       method: "POST",
//       body: data,
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("Success:", result);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//
//     // // if (responseJson.status == 1) {
//     //   console.log("Upload Successful");
//     // }
//   };
//
//   takePicture = async () => {
//     if (this.camera) {
//       let photo = await this.camera.takePictureAsync();
//       var image = photo.uri;
//       this.uploadImage(image);
//     }
//   };
//
//   render() {
//     const { hasCameraPermission } = this.state;
//
//     if (hasCameraPermission === null) {
//       return <View />;
//     } else if (hasCameraPermission === false) {
//       return <Text>Access to camera has been denied.</Text>;
//     } else {
//       return (
//         <View style={{ flex: 1, alignItems: "flex-end" }}>
//           <Camera
//             style={styles.preview}
//             ref={(ref) => {
//               this.camera = ref;
//             }}
//           />
//
//           <TouchableOpacity
//             style={{
//               alignSelf: "flex-end",
//               alignItems: "center",
//               backgroundColor: "transparent",
//             }}
//             onPress={() => this.takePicture()}
//           >
//             <FontAwesome
//               name="camera"
//               style={{ color: "#fff", fontSize: 40 }}
//             />
//           </TouchableOpacity>
//         </View>
//       );
//     }
//   }
// }

import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";

const Blob = RNFetchBlob.polyfill.Blob;

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  uploadImage = async (response) => {
    //     //creatig the form data
    const data = new FormData();
    const imageFile = RNFetchBlob.wrap(path);
    let uploadBlob;
    await Blob.buid(imageFile, { type: "image/jpg;" }).then((imageBlob) => {
      uploadBlob = imageBlob;
    });
    // const base64 = await this.blobToBase64(response);
    const fileToUpload = {
      uri: response,
      name: filename,
      type: type,
    };
    data.append("digit", uploadBlob);
    fetch("https://f1abd62234a3.ngrok.io/predict-digit", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // // if (responseJson.status == 1) {
    //   console.log("Upload Successful");
    // }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.data });
        this.uploadImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };
  // try {
  //   const res = await DocumentPicker.pick({
  //     //Provide which type of file you want user to pick
  //     type: [DocumentPicker.types.images],
  //   });
  //   //Printing the log realted to the file
  //   console.log("res : " + JSON.stringify(res));
  //   //Setting the state to show single file attributes
  //   uploadImage(res);
  // } catch (err) {
  //   //Handling any exception (If any)
  //   if (DocumentPicker.isCancel(err)) {
  //     //If user canceled the document selection
  //     alert("Canceled from single doc picker");
  //   } else {
  //     //For Unknown Error
  //     alert("Unknown Error: " + JSON.stringify(err));
  //     throw err;
  //   }
  // }
  // };
}
