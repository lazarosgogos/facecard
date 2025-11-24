import { Button, Text, View, StyleSheet} from "react-native";
import UploadSelfieComponent from "../UploadSelfieComponent";
import { useState } from "react";


export default function SelectEventFooter() {
    const [ok, setOk] = useState(false);
    const perform = () => {
        
    }

    function handleReadiness(status){
        setOk(status)
    }
    
    return (
        
        <View>
            <UploadSelfieComponent handleChangeInStatus={handleReadiness}/>
            <View style={{alignSelf:'auto', padding:16,}}> 
                {!ok && <Text>You must choose a photo and upload it to the system first!</Text>}
                <Button title="Begin search" onPress={perform} disabled={!ok}/>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    
})