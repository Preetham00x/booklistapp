// Blend utility functions for calculating taste matches and recommendations

// Available genres for books
export const GENRES = [
    'Fantasy',
    'Sci-Fi',
    'Romance',
    'Mystery',
    'Thriller',
    'Horror',
    'Literary Fiction',
    'Historical Fiction',
    'Dark Academia',
    'Young Adult',
    'Non-Fiction',
    'Biography',
    'Self-Help',
    'Poetry',
    'Graphic Novel'
];

// Generate a unique 6-character invite code
export const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Calculate weight for a book based on recency and rating
const getBookWeight = (book) => {
    let weight = 1;

    // Recent books (last 30 days) get 2x weight
    if (book.readDate) {
        const readDate = new Date(book.readDate);
        const daysSinceRead = (Date.now() - readDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceRead <= 30) {
            weight *= 2;
        } else if (daysSinceRead <= 90) {
            weight *= 1.5;
        }
    }

    // Highly rated books (4-5 stars) get 1.5x weight
    if (book.rating >= 4) {
        weight *= 1.5;
    } else if (book.rating >= 3) {
        weight *= 1.2;
    }

    // Favorites get extra weight
    if (book.isFavorite) {
        weight *= 1.3;
    }

    return weight;
};

// Extract weighted genres from a user's books
const getWeightedGenres = (books) => {
    const genreWeights = {};

    books.forEach(book => {
        if (book.genre) {
            const weight = getBookWeight(book);
            const genres = Array.isArray(book.genre) ? book.genre : [book.genre];
            genres.forEach(g => {
                genreWeights[g] = (genreWeights[g] || 0) + weight;
            });
        }
    });

    return genreWeights;
};

// Find shared genres between two users with match percentages
export const findSharedGenres = (books1, books2) => {
    const genres1 = getWeightedGenres(books1);
    const genres2 = getWeightedGenres(books2);

    const sharedGenres = [];
    const allGenres = new Set([...Object.keys(genres1), ...Object.keys(genres2)]);

    allGenres.forEach(genre => {
        const weight1 = genres1[genre] || 0;
        const weight2 = genres2[genre] || 0;

        if (weight1 > 0 && weight2 > 0) {
            // Calculate overlap percentage based on minimum weight
            const minWeight = Math.min(weight1, weight2);
            const maxWeight = Math.max(weight1, weight2);
            const overlap = (minWeight / maxWeight) * 100;

            sharedGenres.push({
                genre,
                matchPercent: Math.round(overlap),
                user1Weight: weight1,
                user2Weight: weight2
            });
        }
    });

    // Sort by combined weight
    return sharedGenres.sort((a, b) =>
        (b.user1Weight + b.user2Weight) - (a.user1Weight + a.user2Weight)
    );
};

// Find shared favorite authors
export const findSharedAuthors = (books1, books2) => {
    const getAuthorWeights = (books) => {
        const weights = {};
        books.forEach(book => {
            if (book.author) {
                const weight = getBookWeight(book);
                weights[book.author.toLowerCase()] = {
                    name: book.author,
                    weight: (weights[book.author.toLowerCase()]?.weight || 0) + weight
                };
            }
        });
        return weights;
    };

    const authors1 = getAuthorWeights(books1);
    const authors2 = getAuthorWeights(books2);

    const sharedAuthors = [];

    Object.keys(authors1).forEach(authorKey => {
        if (authors2[authorKey]) {
            sharedAuthors.push({
                name: authors1[authorKey].name,
                combinedWeight: authors1[authorKey].weight + authors2[authorKey].weight
            });
        }
    });

    return sharedAuthors.sort((a, b) => b.combinedWeight - a.combinedWeight);
};

// Find books both users have read
export const findSharedBooks = (books1, books2) => {
    const bookKeys1 = new Set(
        books1.map(b => `${b.title.toLowerCase()}-${b.author.toLowerCase()}`)
    );

    return books2.filter(book =>
        bookKeys1.has(`${book.title.toLowerCase()}-${book.author.toLowerCase()}`)
    );
};

// Calculate overall taste match percentage
export const calculateTasteMatch = (books1, books2) => {
    if (books1.length === 0 || books2.length === 0) {
        return 0;
    }

    // Genre overlap score (40% of total)
    const sharedGenres = findSharedGenres(books1, books2);
    const genres1 = new Set(books1.flatMap(b => Array.isArray(b.genre) ? b.genre : [b.genre]).filter(Boolean));
    const genres2 = new Set(books2.flatMap(b => Array.isArray(b.genre) ? b.genre : [b.genre]).filter(Boolean));
    const totalGenres = new Set([...genres1, ...genres2]).size;
    const genreScore = totalGenres > 0 ? (sharedGenres.length / totalGenres) * 100 : 0;

    // Author overlap score (30% of total)
    const sharedAuthors = findSharedAuthors(books1, books2);
    const authors1 = new Set(books1.map(b => b.author?.toLowerCase()).filter(Boolean));
    const authors2 = new Set(books2.map(b => b.author?.toLowerCase()).filter(Boolean));
    const totalAuthors = new Set([...authors1, ...authors2]).size;
    const authorScore = totalAuthors > 0 ? (sharedAuthors.length / totalAuthors) * 100 : 0;

    // Shared books score (30% of total)
    const sharedBooks = findSharedBooks(books1, books2);
    const totalBooks = new Set([
        ...books1.map(b => `${b.title.toLowerCase()}-${b.author.toLowerCase()}`),
        ...books2.map(b => `${b.title.toLowerCase()}-${b.author.toLowerCase()}`)
    ]).size;
    const bookScore = totalBooks > 0 ? (sharedBooks.length / totalBooks) * 100 : 0;

    // Weighted average
    const finalScore = (genreScore * 0.4) + (authorScore * 0.3) + (bookScore * 0.3);

    return Math.min(100, Math.round(finalScore * 1.5)); // Scale up slightly for better UX
};

// Generate blended book recommendations
export const getBlendedRecommendations = (allBooks, sharedGenres, sharedAuthors) => {
    // Get top shared genres
    const topGenres = sharedGenres.slice(0, 3).map(g => g.genre);
    const topAuthors = sharedAuthors.slice(0, 3).map(a => a.name.toLowerCase());

    // Score each book based on how well it matches shared tastes
    const scoredBooks = allBooks.map(book => {
        let score = 0;

        // Genre match
        const bookGenres = Array.isArray(book.genre) ? book.genre : [book.genre];
        bookGenres.forEach(g => {
            if (topGenres.includes(g)) {
                score += 3;
            }
        });

        // Author match
        if (topAuthors.includes(book.author?.toLowerCase())) {
            score += 2;
        }

        // Rating boost
        if (book.rating >= 4) {
            score += 1;
        }

        return { ...book, recommendScore: score };
    });

    // Return top recommendations (exclude already-read books by both)
    return scoredBooks
        .filter(b => b.recommendScore > 0)
        .sort((a, b) => b.recommendScore - a.recommendScore)
        .slice(0, 6);
};

// Generate taste description based on shared genres
export const generateTasteDescription = (sharedGenres) => {
    if (sharedGenres.length === 0) {
        return "Start adding books to discover your shared tastes!";
    }

    const topGenres = sharedGenres.slice(0, 3).map(g => g.genre);

    if (topGenres.length === 1) {
        return `You both love ${topGenres[0]}`;
    } else if (topGenres.length === 2) {
        return `You both love ${topGenres[0]} and ${topGenres[1]}`;
    } else {
        return `You both love ${topGenres.slice(0, -1).join(', ')}, and ${topGenres[topGenres.length - 1]}`;
    }
};

// Get a gradient style based on blend member colors
export const getBlendGradient = (member1, member2) => {
    // Generate colors from user names/ids
    const getColorFromString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 50%)`;
    };

    const color1 = getColorFromString(member1 || 'user1');
    const color2 = getColorFromString(member2 || 'user2');

    return `linear-gradient(135deg, ${color1}, ${color2})`;
};
