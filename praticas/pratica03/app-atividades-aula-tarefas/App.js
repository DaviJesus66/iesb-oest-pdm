import { StatusBar } from 'expo-status-bar';
import { Button ,StyleSheet, Text, TextInput, View } from 'react-native';
import { titulo, titulo_padrao } from './util';
import { rotulo_btn_cadastro_meta, rotulo_input_meta, rotulo_listas_metas} from './mensagens';


export default function App() {
  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', }}>
        <View style={{ width: '65%' }}>
          <TextInput
            style={[styles.padrao, styles.primari1]}
            placeholder={rotulo_input_meta}
          />
        </View>
        <View style={{ width: '30%',}}>
          <Button
            style={styles.padrao}
            title={rotulo_btn_cadastro_meta}
          />
        </View>
      </View>
      <View>
        <Text style={styles.padrao}>{rotulo_listas_metas}</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainContainer:{
    margin:20,
    marginTop:55,
  },

  padrao:{
  marginBottom: 10,
  },

  primari1 :{
    borderColor:'#cccccc',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgb(227, 228, 227)'
  }

});
