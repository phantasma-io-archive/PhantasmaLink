async checkForEcto() {
    if (!!window.PhantasmaLinkSocket == true) {
        this.phantasmaLinkConfig.providerHint = 'ecto';
    };
};