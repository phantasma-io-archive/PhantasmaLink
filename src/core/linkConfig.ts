export class linkConfig{

    requiredVersion: number;
    platform: string;
    providerHint: string;

    constructor(_options: Array<string> = null){

        if(_options == null){
            this.setConfig('default');
        }else{

            try {
                this.requiredVersion = _options[0];
                this.platform = _options[1];
                this.providerHint = _options[2];
            } catch (error) {
                console.log(error);
            }

        }

    }

    setConfig(_provider: string){
        
        this.requiredVersion = 2;
        this.platform = "phantasma";

        switch(_provider){
            case 'default':
                this.providerHint = "";
            break;

            case 'ecto':
                this.providerHint = "ecto";
            break;

            case 'poltergeist':
                this.providerHint = "poltergeist";
            break;
        }
    }

}
