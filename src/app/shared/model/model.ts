export class ClearStorageResponse {
    error: boolean;
    reponse: {
        message: string
    };
}

export class LoggedInUserData {
    displayName: string;
    email: string;
    emailVerified: string;
    metadata: {
        a: string;
        b: string;
        creationTime: string;
        lastSignInTime: string;
    };
    phoneNumber: string;
    photoURL: string;
    qa: string;
    uid: string;
}

export class LoggedInUserDataInResponse {
    error: boolean;
    response: {
        displayName: string;
        email: string;
        emailVerified: string;
        metadata: {
            a: string;
            b: string;
            creationTime: string;
            lastSignInTime: string;
        };
        phoneNumber: string;
        photoURL: string;
        qa: string;
        uid: string;
    };
}
