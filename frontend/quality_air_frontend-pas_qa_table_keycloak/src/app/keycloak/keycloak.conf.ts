import { KeycloakConfig} from 'keycloak-js';
import { environment } from '../../environments/environment'

const keycloakConfig: KeycloakConfig = {
  url: environment.keycloakUrl,
  realm: environment.keycloakReaml,
  clientId: environment.keycloakClient
  
};

export default keycloakConfig;