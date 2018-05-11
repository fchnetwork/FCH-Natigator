declare module "eth-ens-namehash" {
    interface NameHash {
        hash(inputName: string): string;
        normalize(inputName: string): string;
    } 

    const namehash: NameHash;
    export = namehash;
}