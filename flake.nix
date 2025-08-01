{
    outputs = {
        nixpkgs
        , ...
    }: let
        forAll = with nixpkgs.lib; (f:
            genAttrs systems.flakeExposed (system: let
                pkgs = import nixpkgs { 
                    inherit system;
                };
            in
            f pkgs
        ));
    in {
        devShells = forAll (pkgs: {
            default = pkgs.mkShell {
                nativeBuildInputs = with pkgs; [
                    hugo
                    dart-sass
                ];
            };
        });
    };
}
