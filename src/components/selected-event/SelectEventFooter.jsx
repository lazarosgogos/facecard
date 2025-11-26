import { Button, Text, View, StyleSheet } from "react-native";
import UploadSelfieComponent from "../UploadSelfieComponent";
import { useState } from "react";
import { useTheme } from "../../ThemeContext";


export default function SelectEventFooter() {
    const [ok, setOk] = useState(false);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const perform = () => {

    }

    function handleReadiness(status) {
        setOk(status)
    }

    return (

        <View>
            <UploadSelfieComponent handleChangeInStatus={handleReadiness} />
            <View style={styles.buttonContainer}>
                {!ok && <Text style={styles.text}>You must choose a photo and upload it to the system first!</Text>}
                <Button title="Begin search" onPress={perform} disabled={!ok} color={theme.primary} />
            </View>
        </View>
    )

}

const getStyles = (theme) => StyleSheet.create({
    buttonContainer: {
        alignSelf: 'auto',
        padding: 16,
    },
    text: {
        color: theme.text,
        marginBottom: 16,
    }
})
