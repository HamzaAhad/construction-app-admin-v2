export const generateRandomPassword = (length) => {
    try {
        const printableAsciiStart = 33; // ASCII value for '!'
        const printableAsciiEnd = 126; // ASCII value for '~'
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomAscii =
                Math.floor(
                    Math.random() * (printableAsciiEnd - printableAsciiStart + 1)
                ) + printableAsciiStart;
            console.log("random asci", randomAscii)
            password += String.fromCharCode(randomAscii);
        }
        console.log("inside password", password)
        return password;
    } catch (error) {
        console.log("Error generating random password:", error);
        return false;
    }
};
