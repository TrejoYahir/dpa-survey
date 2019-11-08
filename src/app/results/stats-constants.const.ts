
export const scales = {
    A: {
        name: 'Interferencia parental',
        questions: [7, 35, 39, 48, 54, 62],
        average: 2.39,
        sd: 0.82
    },
    B: {
        name: 'Preocupación familiar',
        questions: [20, 22, 32, 56, 68, 72],
        average: 2.73,
        sd: 0.84
    },
    C: {
        name: 'Resentimiento de infantilización',
        questions: [2, 26, 41, 52, 55, 64],
        average: 2.46,
        sd: 0.96
    },
    D: {
        name: 'Apoyo parental',
        questions: [9, 21, 42, 53, 58, 66],
        average: 3.63,
        sd: 0.90
    },
    E: {
        name: 'Apoyo familiar',
        questions: [1, 4, 18, 27, 36, 69],
        average: 3.86,
        sd: 0.79
    },
    F: {
        name: 'Reconocimiento de apoyo',
        questions: [6, 10, 11, 19, 25, 28],
        average: 3.96,
        sd: 0.75
    },
    G: {
        name: 'Indisponibilidad parental',
        questions: [15, 29, 30, 31, 38, 71],
        average: 2.38,
        sd: 0.85

    },
    H: {
        name: 'Distancia familiar',
        questions: [18, 20, 23],
        average: 3.35,
        sd: 0.88
    },
    I: {
        name: 'Resentimiento de rechazo',
        questions: [13, 47, 50, 57, 60, 67],
        average: 2.06,
        sd: 0.92
    },
    J: {
        name: 'Traumatismo parental',
        questions: [3, 33, 45, 59, 61, 63],
        average: 1.88,
        sd: 0.90
    },
    K: {
        name: 'Bloqueo de recuerdos',
        questions: [37, 46, 51],
        average: 2.64,
        sd: 0.99
    },
    L: {
        name: 'Dimisión parental',
        questions: [5, 16, 23, 42, 44, 70],
        average: 1.66,
        sd: 0.61
    },
    M: {
        name: 'Valoración de la jerarquía',
        questions: [8, 24, 34, 43, 49, 65],
        average: 4.10,
        sd: 0.60
    },
};

export const models = {
    safe: {
        model: [4, 2, 2, 4, 1, 5, 3, 5, 5, 4, 5, 4, 2, 3, 2, 1, 3,
            4, 5, 3, 4, 4, 3, 3, 4, 3, 5, 4, 2, 3, 3, 4, 2, 4, 3,
            5, 3, 3, 2, 4, 3, 2, 5, 1, 1, 3, 1, 2, 5, 2, 3, 2, 5,
            2, 1, 3, 1, 5, 1, 1, 1, 2, 2, 2, 4, 5, 1, 3, 4, 3, 1, 3],
        media: 0.528,
        deviation: 0.321
    },

    evasive: {
        model: [1, 3, 4, 2, 3, 1, 4, 4, 2, 3, 5, 5, 2, 5, 4, 3, 5, 1,
            5, 1, 3, 1, 4, 5, 2, 4, 1, 2, 4, 4, 4, 1, 3, 4, 5, 2, 5,
            5, 2, 1, 2, 3, 2, 3, 3, 4, 2, 1, 2, 3, 5, 2, 4, 3, 3, 1,
            5, 3, 4, 2, 2, 4, 3, 3, 4, 2, 5, 1, 3, 3, 3, 1],
        media: -0.039,
        deviation: 0.157
    },

    worried: {
        model: [1, 4, 3, 1, 3, 1, 5, 2, 1, 2, 2, 2, 5, 1, 3, 3, 1, 3,
            2, 5, 2, 5, 2, 1, 2, 4, 5, 2, 4, 4, 4, 5, 3, 3, 4, 1, 2, 3,
            5, 2, 5, 3, 3, 3, 3, 4, 3, 4, 4, 4, 1, 5, 1, 4, 4, 5, 2, 1,
            3, 4, 2, 4, 3, 4, 3, 3, 1, 5, 2, 3, 2, 5],
        media: -0.151,
        deviation: 0.181
    }
};

export const scaleList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
