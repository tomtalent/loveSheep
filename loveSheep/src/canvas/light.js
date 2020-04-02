import {Group} from 'three'
import * as THREE from 'three'

export default class LIght extends Group {

    constructor(props){
        super(props)
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
  
        const directLight1 = new THREE.DirectionalLight(0xffd798, 0.8);
        directLight1.castShadow = true;
        directLight1.position.set(19.5, 18.2, 8.3);
  
        const directLight2 = new THREE.DirectionalLight(0xc9ceff, 0.5);
        directLight2.castShadow = true;
        directLight2.position.set(-15.8, 15.2, 18);

        this.add(hemiLight, directLight1, directLight2)
    }
}