export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "Foundations" | "Core Models" | "Techniques" | "Applications" | "Advanced Research";

export interface TopicSection {
  title: string;
  content: string;
  code?: string;
}

export interface Topic {
  id: number;
  slug: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  readTime: number;
  description: string;
  sections: TopicSection[];
  relatedSlugs: string[];
}

export const topics: Topic[] = [
  {
    id: 1,
    slug: "what-is-generative-ai",
    title: "What is Generative AI",
    category: "Foundations",
    difficulty: "Beginner",
    readTime: 8,
    description: "An introduction to generative AI — what it is, how it differs from traditional AI, and why it matters.",
    relatedSlugs: ["history-of-ai", "neural-networks-basics", "large-language-models"],
    sections: [
      {
        title: "Defining Generative AI",
        content: `Generative AI refers to a class of machine learning systems that can create new content — text, images, audio, video, code, or even 3D objects — that resembles data they were trained on. Unlike traditional software that follows explicit rules, generative models learn statistical patterns from vast datasets and use those patterns to synthesize novel outputs.

The key insight is that these models learn a probability distribution over the training data. Once trained, they can sample from that distribution to generate new examples that didn't exist before, yet feel consistent with what the model learned.

Generative AI is contrasted with discriminative AI. A discriminative model (like a spam classifier or image recognizer) learns the boundary between categories — it answers "which class does this belong to?" A generative model learns the underlying structure of the data itself — it can answer "generate me a new example of this class."`
      },
      {
        title: "Discriminative vs Generative Models",
        content: `To understand generative AI, it helps to compare it with its counterpart. A discriminative model learns P(label | data) — given an input, what is the probability of each label? These models are great at classification tasks.

A generative model learns P(data) or P(data | label) — it models the distribution of the data itself. This allows it to generate new data samples. For example, a generative model trained on cat photos learns what makes a cat photo look like a cat photo, and can then produce entirely new cat images.

Modern generative models fall into several families: Variational Autoencoders (VAEs), Generative Adversarial Networks (GANs), Diffusion Models, and Autoregressive Transformers — each with different strengths and architectural approaches.`,
      },
      {
        title: "Real-World Applications",
        content: `Generative AI has moved from research labs to mainstream products at extraordinary speed. Here are the domains being transformed:

Text Generation: Large language models like GPT-4, Claude, and Gemini can write essays, answer questions, summarize documents, translate languages, and hold complex conversations. They power customer service chatbots, coding assistants, and creative writing tools.

Image Generation: Models like Stable Diffusion, DALL-E, and Midjourney can create photorealistic images, artistic illustrations, and product mockups from text descriptions. Designers, filmmakers, and marketers use these daily.

Audio and Music: Systems like Suno and Udio generate full music tracks from text prompts. Text-to-speech systems can clone voices and produce natural-sounding narration.

Code Generation: GitHub Copilot and similar tools autocomplete code, write unit tests, explain existing code, and generate entire functions or modules from natural language descriptions.

Video and 3D: Emerging tools like Sora generate short video clips from text, while others generate 3D models from image or text inputs.`
      },
      {
        title: "Why Now? The Ingredients for the GenAI Explosion",
        content: `Generative AI isn't new — researchers have worked on it for decades. So why did it explode in 2022–2024? Three ingredients came together:

1. Scale: The transformer architecture (introduced in 2017) scales extraordinarily well. As you add more parameters and training data, performance improves in ways that weren't anticipated — including the emergence of capabilities that weren't explicitly trained.

2. Data: The internet provided an unprecedented corpus of text, images, and other media. Training on this diverse, massive dataset gave models broad general knowledge.

3. Compute: GPU hardware (especially NVIDIA's H100 and A100 chips) became powerful enough to train models with hundreds of billions of parameters. Companies invested billions of dollars in compute clusters.

The combination of the right architecture, enough data, and enough compute created a phase transition in AI capability.`
      },
      {
        title: "Limitations and Challenges",
        content: `Despite impressive capabilities, generative AI has significant limitations:

Hallucination: Language models can generate confident-sounding but factually incorrect statements. This is a fundamental challenge because the model predicts likely text, not necessarily true text.

Bias and Safety: Models trained on internet data absorb the biases present in that data. They can generate harmful, biased, or inappropriate content if not carefully constrained.

Computational Cost: Training frontier models costs tens to hundreds of millions of dollars. Even inference (generating a single response) requires significant compute.

Context Length: Models have a finite context window — they can only "see" a limited amount of text at once, which limits their ability to reason over long documents.

Evaluation: It's often difficult to objectively measure whether a generative model's output is "good," especially for creative tasks.

Understanding these limitations is essential for building systems that use generative AI responsibly and effectively.`
      }
    ]
  },
  {
    id: 2,
    slug: "history-of-ai",
    title: "Brief History of AI",
    category: "Foundations",
    difficulty: "Beginner",
    readTime: 10,
    description: "From perceptrons to deep learning to the transformer revolution — key milestones in AI development.",
    relatedSlugs: ["what-is-generative-ai", "neural-networks-basics", "transformers"],
    sections: [
      {
        title: "The Early Years (1950s–1980s)",
        content: `The story of artificial intelligence begins with Alan Turing's 1950 paper "Computing Machinery and Intelligence," which proposed the famous Turing Test as a measure of machine intelligence. In 1956, the Dartmouth Conference coined the term "Artificial Intelligence" and set the field's ambitious early agenda.

The perceptron, invented by Frank Rosenblatt in 1957, was the first trainable neural network unit. It could learn to classify linearly separable patterns. Enthusiasm was high — until Marvin Minsky and Seymour Papert's 1969 book "Perceptrons" demonstrated that single-layer perceptrons couldn't solve the XOR problem, triggering the first "AI Winter" — a period of reduced funding and interest.

Expert systems dominated the 1980s. These rule-based systems encoded human expert knowledge explicitly. While effective in narrow domains, they were brittle and expensive to maintain. Their limitations contributed to a second AI winter in the late 1980s.`
      },
      {
        title: "The Deep Learning Revolution (1986–2012)",
        content: `The backpropagation algorithm, popularized by Rumelhart, Hinton, and Williams in 1986, showed how to train multi-layer neural networks by propagating error gradients backward through the network. This was the theoretical foundation for deep learning, though hardware limitations prevented it from scaling.

Yann LeCun applied convolutional networks to handwritten digit recognition in 1989, demonstrating the power of architectures designed for spatial data. His LeNet-5 was successfully used for reading checks at banks.

The real breakthrough came in 2012 when AlexNet — a deep convolutional network trained on GPUs — won the ImageNet competition by a stunning margin, reducing the error rate from 26% to 15%. This moment marked the beginning of the deep learning era. The key insight was that GPUs enabled training much larger networks on much larger datasets than had been possible before.

Recurrent neural networks (RNNs) and their variants — LSTMs and GRUs — advanced sequence modeling, enabling speech recognition, machine translation, and language modeling.`
      },
      {
        title: "The Transformer Revolution (2017–Present)",
        content: `In 2017, researchers at Google Brain published "Attention Is All You Need," introducing the Transformer architecture. Unlike RNNs, Transformers process all positions in a sequence simultaneously using self-attention, making them highly parallelizable and capable of capturing long-range dependencies.

GPT (Generative Pre-trained Transformer) from OpenAI in 2018 demonstrated that pre-training a large transformer on internet text, then fine-tuning for specific tasks, produced remarkable performance. GPT-2 (2019) was large enough that OpenAI initially declined to release it, citing misuse concerns — a watershed moment in AI safety discussions.

BERT (2018) from Google showed that bidirectional pre-training on masked language modeling produced powerful representations for downstream tasks. It dominated NLP benchmarks for years.

The scaling hypothesis emerged: if you make transformers bigger and train them on more data, they keep getting better — sometimes in surprising, discontinuous ways. GPT-3 (175 billion parameters, 2020) demonstrated few-shot learning abilities that stunned researchers. ChatGPT (November 2022) brought these capabilities to the mainstream, reaching 100 million users in two months — the fastest product adoption in history.`
      },
      {
        title: "The Diffusion Model Era",
        content: `While language models dominated headlines, a parallel revolution was happening in image generation. Diffusion models — inspired by non-equilibrium thermodynamics — learned to generate images by learning to reverse a gradual noising process.

DALL-E (2021), Stable Diffusion (2022), and Midjourney transformed image creation. Stable Diffusion's open-source release democratized image generation, spawning thousands of fine-tuned variants and applications.

These developments happened in parallel with multimodal research. CLIP (2021) learned joint representations of images and text, enabling zero-shot image classification and powering text-guided image generation. GPT-4V (2023) and similar models processed both images and text, opening the door to visual question answering, document analysis, and more.`
      }
    ]
  },
  {
    id: 3,
    slug: "neural-networks-basics",
    title: "Neural Networks Basics",
    category: "Foundations",
    difficulty: "Beginner",
    readTime: 12,
    description: "Neurons, layers, activation functions, forward pass, and backpropagation — the building blocks of deep learning.",
    relatedSlugs: ["what-is-generative-ai", "loss-functions-optimization", "transformers"],
    sections: [
      {
        title: "What is a Neuron?",
        content: `A biological neuron receives signals through dendrites, processes them in the cell body, and fires an output signal through its axon when the input exceeds a threshold. Artificial neural networks are loosely inspired by this structure, though the analogy shouldn't be taken too literally.

An artificial neuron (also called a node or unit) computes a weighted sum of its inputs, adds a bias term, and applies an activation function:

output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)

Where x₁...xₙ are inputs, w₁...wₙ are learnable weights, b is a learnable bias, and activation is a non-linear function. The weights and bias are the parameters the network learns during training.`,
        code: `# A single neuron in Python/NumPy
import numpy as np

def neuron(inputs, weights, bias):
    weighted_sum = np.dot(inputs, weights) + bias
    return relu(weighted_sum)

def relu(x):
    return np.maximum(0, x)

# Example
inputs  = np.array([1.0, 2.0, 3.0])
weights = np.array([0.5, -0.3, 0.8])
bias    = 0.1

output = neuron(inputs, weights, bias)
print(output)  # 2.3`
      },
      {
        title: "Layers and Network Architecture",
        content: `Neurons are organized into layers. A typical feedforward neural network has:

Input Layer: Receives the raw data. No computation happens here — it simply passes data to the next layer.

Hidden Layers: One or more layers where the actual computation happens. Each hidden neuron connects to every neuron in the previous layer (in a fully-connected or "dense" network). These layers extract increasingly abstract features.

Output Layer: Produces the network's final output. The number of neurons matches the task: one neuron for binary classification, N neurons for N-class classification, etc.

"Deep" neural networks simply have many hidden layers. Depth allows the network to learn hierarchical representations — early layers capture simple features (edges, textures), later layers capture complex ones (faces, objects, concepts).`
      },
      {
        title: "Activation Functions",
        content: `Without activation functions, a neural network — no matter how many layers — collapses into a single linear transformation. Activation functions introduce non-linearity, enabling networks to learn complex patterns.

ReLU (Rectified Linear Unit): f(x) = max(0, x). Simple, effective, and the default choice for hidden layers. Fast to compute and doesn't suffer from vanishing gradients for positive inputs.

Sigmoid: f(x) = 1/(1+e^(-x)). Outputs between 0 and 1. Used in binary classification output layers. Prone to vanishing gradients for large inputs.

Tanh: f(x) = (e^x - e^(-x))/(e^x + e^(-x)). Outputs between -1 and 1. Zero-centered, often preferred over sigmoid for hidden layers.

Softmax: Converts a vector of raw scores into a probability distribution that sums to 1. Used in multi-class classification output layers.

GELU (Gaussian Error Linear Unit): A smooth approximation of ReLU used widely in transformers. Performs better than ReLU in many modern architectures.`,
        code: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

def relu(x):
    return np.maximum(0, x)

def gelu(x):
    return 0.5 * x * (1 + np.tanh(np.sqrt(2/np.pi) * (x + 0.044715 * x**3)))

def softmax(x):
    e_x = np.exp(x - np.max(x))  # subtract max for numerical stability
    return e_x / e_x.sum()`
      },
      {
        title: "Forward Pass",
        content: `The forward pass is how a neural network makes a prediction. Data flows from the input layer through each hidden layer to the output layer, with each layer applying its weights, biases, and activation function.

For a two-layer network:
1. Hidden layer output h = activation(W₁x + b₁)
2. Output layer output y = activation(W₂h + b₂)

During training, we compare y (the prediction) to the true label using a loss function. During inference, we just run the forward pass and use y directly.

The forward pass is deterministic — given the same inputs and weights, it always produces the same output. The weights are what get learned during training.`
      },
      {
        title: "Backpropagation",
        content: `Backpropagation is the algorithm that teaches a neural network by adjusting its weights to reduce prediction errors. It works by computing how much each weight contributed to the error and nudging it in the direction that reduces that error.

The algorithm has two phases:
1. Forward Pass: Compute the prediction and the loss.
2. Backward Pass: Use the chain rule of calculus to compute the gradient of the loss with respect to every weight in the network, starting from the output and working backward.

The chain rule says: if y depends on h which depends on x, then dy/dx = dy/dh × dh/dx. This allows us to decompose the gradient computation into manageable pieces, one layer at a time.

Once we have the gradients, we update each weight using gradient descent:
w = w - learning_rate × (∂loss/∂w)

This process repeats for many mini-batches of data until the network converges to a good set of weights.`
      }
    ]
  },
  {
    id: 4,
    slug: "probability-statistics",
    title: "Probability & Statistics for GenAI",
    category: "Foundations",
    difficulty: "Beginner",
    readTime: 14,
    description: "Probability distributions, Bayes theorem, maximum likelihood estimation, KL divergence, and entropy — the mathematical language of generative models.",
    relatedSlugs: ["neural-networks-basics", "vaes", "diffusion-models"],
    sections: [
      {
        title: "Why Probability Matters for Generative AI",
        content: `Generative AI is fundamentally about probability. When a language model generates text, it samples from a probability distribution over possible next tokens. When a diffusion model generates an image, it samples from a learned distribution over pixel values. Understanding probability is the key to understanding what these models actually do.

A probability distribution describes how likely different outcomes are. For a discrete variable (like a word in a vocabulary), we have a probability mass function: P(X=x) for each value x. For continuous variables (like pixel intensities), we have a probability density function p(x).`
      },
      {
        title: "Key Distributions",
        content: `Gaussian (Normal) Distribution: The bell curve. Characterized by mean μ and variance σ². Appears everywhere in machine learning — as priors in VAEs, as noise in diffusion models, as initialization distributions for weights. The standard normal has μ=0, σ=1.

Categorical Distribution: A distribution over K discrete categories, parameterized by probabilities p₁...pK that sum to 1. Language model outputs are categorical distributions over the vocabulary.

Bernoulli Distribution: Special case of categorical with K=2. Used for binary outcomes.

Uniform Distribution: All values equally likely. Often used as a starting point or reference distribution.

Latent Distributions: Many generative models learn to map data to a latent space — a lower-dimensional space where the data's structure is encoded. The prior distribution over this latent space (often a standard normal) shapes what the model can generate.`
      },
      {
        title: "Bayes' Theorem",
        content: `Bayes' theorem is the mathematical foundation for updating beliefs given evidence:

P(A|B) = P(B|A) × P(A) / P(B)

In generative modeling terms:
- P(A) is the prior — what we believe before seeing data
- P(B|A) is the likelihood — how probable is the observed data given our hypothesis
- P(A|B) is the posterior — updated belief after seeing the data

Many generative models are framed as inference problems: given observed data x, infer the latent variables z that generated it. The posterior P(z|x) is what we want, but it's often intractable to compute exactly. This drives the development of approximate inference methods like variational inference (used in VAEs).`
      },
      {
        title: "Maximum Likelihood Estimation",
        content: `Maximum Likelihood Estimation (MLE) is the most common way to train generative models. The idea: find the model parameters θ that maximize the probability of the observed training data.

L(θ) = P(data | θ) = ∏ᵢ P(xᵢ | θ)

We maximize the log-likelihood (equivalent, numerically more stable):
log L(θ) = Σᵢ log P(xᵢ | θ)

Training a language model on text is MLE: we adjust the model's parameters to maximize the probability it assigns to the actual training sequences. For autoregressive models, this decomposes into maximizing the probability of each token given its context — which is just the cross-entropy loss.`
      },
      {
        title: "KL Divergence and Entropy",
        content: `Information theory provides tools to measure the "distance" between probability distributions — critical for training generative models.

Entropy H(P) = -Σ P(x) log P(x) measures the average amount of information in a distribution. High entropy means high uncertainty (many equally likely outcomes). Low entropy means the distribution is concentrated.

Cross-entropy H(P, Q) = -Σ P(x) log Q(x) measures how well distribution Q approximates distribution P. When we train a model with cross-entropy loss, we're minimizing the cross-entropy between the true data distribution and the model's predicted distribution.

KL Divergence D_KL(P || Q) = Σ P(x) log(P(x)/Q(x)) = H(P, Q) - H(P) measures how much Q differs from P. It's always non-negative, and equals zero only when P = Q. The KL divergence appears in VAE training (regularizing the latent space) and in RLHF (preventing the fine-tuned model from drifting too far from the base model).`
      }
    ]
  },
  {
    id: 5,
    slug: "loss-functions-optimization",
    title: "Loss Functions & Optimization",
    category: "Foundations",
    difficulty: "Beginner",
    readTime: 10,
    description: "MSE, cross-entropy, gradient descent, Adam optimizer — how neural networks learn from mistakes.",
    relatedSlugs: ["neural-networks-basics", "probability-statistics", "vaes"],
    sections: [
      {
        title: "What is a Loss Function?",
        content: `A loss function (also called a cost function or objective function) measures how wrong a model's predictions are. Training a neural network means minimizing this loss. The choice of loss function encodes what "wrong" means for your specific task.

A good loss function must be: differentiable (so we can compute gradients), appropriately shaped (gradients should guide toward better solutions), and aligned with what you actually care about (which is sometimes hard — the loss is a proxy for real-world performance).`
      },
      {
        title: "Common Loss Functions",
        content: `Mean Squared Error (MSE): Used for regression. Computes the average squared difference between predictions and targets: L = (1/n) Σ (ŷᵢ - yᵢ)². Penalizes large errors heavily due to squaring.

Mean Absolute Error (MAE): More robust to outliers than MSE. L = (1/n) Σ |ŷᵢ - yᵢ|.

Cross-Entropy Loss: The standard loss for classification and language modeling. For binary classification: L = -[y log(p) + (1-y) log(1-p)]. For multi-class: L = -Σ yᵢ log(pᵢ). Derived from MLE — minimizing cross-entropy is equivalent to maximizing the likelihood of the training data.

ELBO (Evidence Lower BOund): Used in VAEs. Balances reconstruction quality against regularization of the latent space.

Adversarial Loss: Used in GANs. The generator and discriminator play a minimax game with competing objectives.`,
        code: `import torch
import torch.nn.functional as F

# Cross-entropy loss
logits = torch.tensor([[2.0, 1.0, 0.1]])  # raw model outputs
targets = torch.tensor([0])               # true class index

loss = F.cross_entropy(logits, targets)
print(f"Cross-entropy loss: {loss.item():.4f}")

# MSE loss
predictions = torch.tensor([1.5, 2.3, 0.8])
targets_reg = torch.tensor([1.0, 2.0, 1.0])

mse_loss = F.mse_loss(predictions, targets_reg)
print(f"MSE loss: {mse_loss.item():.4f}")`
      },
      {
        title: "Gradient Descent",
        content: `Gradient descent is the core optimization algorithm for training neural networks. The intuition: if you're standing on a hilly landscape and want to reach the lowest point, keep taking steps in the direction of steepest descent.

The gradient ∇L(θ) points in the direction of steepest increase in the loss. So we move in the opposite direction:
θ ← θ - α ∇L(θ)

where α is the learning rate — a hyperparameter controlling step size.

Stochastic Gradient Descent (SGD): Instead of computing the gradient over the entire dataset (too slow for large datasets), SGD computes the gradient on a single random example. This is noisy but fast.

Mini-batch Gradient Descent: The practical standard. Compute the gradient on a small batch (32–256 examples). Balances the noise reduction of full-batch GD with the speed of SGD.`
      },
      {
        title: "Adam and Modern Optimizers",
        content: `Vanilla SGD works, but modern optimizers are significantly better in practice.

Adam (Adaptive Moment Estimation) maintains a running estimate of both the gradient (first moment) and its variance (second moment), and uses these to adapt the learning rate for each parameter individually. Parameters with historically large gradients get smaller updates; parameters with historically small gradients get larger updates.

Adam hyperparameters: learning rate (typically 1e-3 or 3e-4), β₁=0.9 (first moment decay), β₂=0.999 (second moment decay), ε=1e-8 (numerical stability).

AdamW: Adam with weight decay properly decoupled from the adaptive learning rate. Standard for transformer training — virtually all LLMs are trained with AdamW.

Learning Rate Scheduling: The learning rate is often annealed (reduced) during training. Common schedules: cosine annealing (smooth cosine curve from max to min LR), linear warmup + cosine decay (used for most LLM training runs).`,
        code: `import torch
import torch.optim as optim

model = torch.nn.Linear(10, 1)

# AdamW optimizer
optimizer = optim.AdamW(
    model.parameters(),
    lr=3e-4,
    betas=(0.9, 0.999),
    weight_decay=0.01
)

# Cosine annealing scheduler
scheduler = optim.lr_scheduler.CosineAnnealingLR(
    optimizer,
    T_max=1000,  # total training steps
    eta_min=1e-6
)

# Training step
optimizer.zero_grad()
loss = some_loss_function(model)
loss.backward()
optimizer.step()
scheduler.step()`
      }
    ]
  },
  {
    id: 6,
    slug: "training-vs-inference",
    title: "Training vs Inference",
    category: "Foundations",
    difficulty: "Beginner",
    readTime: 7,
    description: "What happens during training vs at inference time, compute costs, and the difference in hardware requirements.",
    relatedSlugs: ["neural-networks-basics", "loss-functions-optimization", "quantization"],
    sections: [
      {
        title: "The Two Phases of a Neural Network's Life",
        content: `Every neural network goes through two distinct phases: training and inference. Understanding the difference is crucial for anyone working with AI systems — they have fundamentally different computational profiles, hardware requirements, and practical considerations.

Training is the process of learning — adjusting the model's weights to minimize a loss function on a dataset. Inference is the process of using the trained model to make predictions on new inputs. Training happens once (or periodically for fine-tuning). Inference happens millions of times in production.`
      },
      {
        title: "What Happens During Training",
        content: `During training, three things happen for each mini-batch:

1. Forward Pass: Compute predictions and loss. The model processes inputs layer by layer, storing intermediate activations (needed for backprop).

2. Backward Pass: Compute gradients via backpropagation. The chain rule is applied in reverse through the network, computing how much each weight contributed to the loss.

3. Weight Update: Apply the optimizer (e.g., AdamW) to adjust weights using the computed gradients. The optimizer maintains its own state (momentum estimates), adding to memory requirements.

Memory during training is dominated by activations (intermediate values stored for backprop), gradients (same size as parameters), and optimizer state (2x parameter count for Adam). For a 7-billion parameter model in fp16, just the parameters take 14GB; with gradients and optimizer state, you might need 50–100GB of GPU memory.

Training is distributed across many GPUs using data parallelism (each GPU processes different data, gradients are averaged) and model parallelism (different layers on different GPUs).`
      },
      {
        title: "What Happens During Inference",
        content: `Inference is simpler: just the forward pass. No gradients, no optimizer state, no stored activations (unless you need them for something else). This makes inference significantly more memory-efficient than training.

For autoregressive generation (like GPT), inference involves generating one token at a time, using the previous tokens as context. The KV (key-value) cache stores attention keys and values for previous tokens, trading memory for speed — without it, you'd recompute everything for every new token.

Inference latency is critical for production applications. Users expect response times under a second. For a large model, generating 100 tokens might take several seconds without optimization.

Key inference optimizations: batching multiple requests together, quantization (reducing numerical precision from fp16 to int8 or int4), speculative decoding (using a small model to draft tokens, then verifying with the large model), and efficient attention implementations like Flash Attention.`
      },
      {
        title: "Compute Costs: The Enormous Scale",
        content: `Training frontier AI models is extraordinarily expensive. GPT-4 is estimated to have cost over $100 million to train. Gemini Ultra and similar models likely cost comparable amounts.

The cost comes from GPU-hours × GPU rental price. A training run for a large model might use 1,000–10,000 A100 GPUs for 3–6 months. At $2–4/hour per GPU, the compute bill alone reaches tens of millions of dollars.

Inference costs at scale are also significant. Serving millions of ChatGPT users requires many thousands of GPUs running 24/7. OpenAI's inference costs were reportedly $700,000/day at peak in early 2023.

This economic reality shapes the industry: only a handful of organizations can train truly frontier models. Most companies use APIs from these organizations, or fine-tune smaller open-source models for specific applications.`
      }
    ]
  },
  {
    id: 7,
    slug: "vaes",
    title: "Variational Autoencoders (VAEs)",
    category: "Core Models",
    difficulty: "Intermediate",
    readTime: 15,
    description: "Encoder-decoder architecture, latent space, reparameterization trick, and the ELBO — understanding VAEs from first principles.",
    relatedSlugs: ["neural-networks-basics", "probability-statistics", "gans", "diffusion-models"],
    sections: [
      {
        title: "Autoencoders: The Foundation",
        content: `Before understanding VAEs, start with regular autoencoders. An autoencoder compresses data into a compact representation (encoding) and then reconstructs the original data from that representation (decoding).

The architecture: Encoder network E(x) → z (latent vector), Decoder network D(z) → x̂ (reconstruction). The network is trained to minimize reconstruction error: L = ||x - x̂||².

The bottleneck (latent space) forces the encoder to learn a compressed representation that captures the most important features of the data. Regular autoencoders can be great for compression and denoising, but they're not generative models — the latent space has no structure we can sample from to generate new data.`
      },
      {
        title: "The VAE Idea: Probabilistic Latent Space",
        content: `VAEs (introduced by Kingma and Welling in 2013) extend autoencoders to be proper generative models. The key idea: instead of encoding input x to a fixed point z, encode it to a distribution over z.

The encoder outputs parameters of a Gaussian: μ(x) and σ(x). We then sample z ~ N(μ(x), σ²(x)) and decode that sample to get the reconstruction. The decoder learns to reconstruct inputs from random samples of the latent distribution, not fixed points.

This forces the latent space to be structured and continuous — similar inputs have overlapping distributions in latent space. Critically, we can sample z ~ N(0, I) from the standard normal prior and decode it to generate entirely new data, not just reconstruct training examples.`
      },
      {
        title: "The Reparameterization Trick",
        content: `There's a problem with the VAE setup: we need to backpropagate through a sampling operation (z ~ N(μ, σ²)), but sampling is not differentiable.

The solution is the reparameterization trick. Instead of sampling z directly, sample noise ε ~ N(0, 1), then compute z = μ + σ × ε. The randomness is "moved outside" the computational graph — we differentiate through μ and σ, not through the sampling.

This clever trick makes the whole system end-to-end differentiable and trainable with standard backpropagation.`,
        code: `import torch
import torch.nn as nn

class VAEEncoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super().__init__()
        self.fc = nn.Linear(input_dim, 256)
        self.fc_mu = nn.Linear(256, latent_dim)
        self.fc_logvar = nn.Linear(256, latent_dim)

    def forward(self, x):
        h = torch.relu(self.fc(x))
        mu = self.fc_mu(h)
        logvar = self.fc_logvar(h)
        return mu, logvar

def reparameterize(mu, logvar):
    # Sample epsilon from standard normal
    eps = torch.randn_like(mu)
    # z = mu + sigma * epsilon (reparameterization trick)
    std = torch.exp(0.5 * logvar)
    return mu + std * eps`
      },
      {
        title: "The ELBO Loss",
        content: `The VAE objective is the Evidence Lower BOund (ELBO). It has two terms:

1. Reconstruction Loss: How well does the decoder reconstruct the input from the sampled z? Typically measured by MSE (for continuous data) or binary cross-entropy (for binary data). This term pushes the model to encode information faithfully.

2. KL Divergence Regularization: How close is the encoder's distribution q(z|x) to the prior p(z) = N(0, I)? Measured by D_KL(q(z|x) || p(z)). This term pushes the latent distribution toward the standard normal, ensuring the latent space is smooth and well-structured.

ELBO = E[log p(x|z)] - D_KL(q(z|x) || p(z))

The first term maximizes likelihood of reconstruction; the second term is a regularizer. The tension between these terms is what makes VAEs work: reconstruction loss wants to encode everything precisely, while KL regularization wants the latent space to look like a standard normal.

For a Gaussian encoder, the KL divergence has a closed form:
D_KL = -0.5 × Σ (1 + log(σ²) - μ² - σ²)`,
        code: `def vae_loss(x, x_recon, mu, logvar, beta=1.0):
    # Reconstruction loss (MSE)
    recon_loss = F.mse_loss(x_recon, x, reduction='sum')
    
    # KL divergence (closed form for Gaussian)
    # -0.5 * sum(1 + log(sigma^2) - mu^2 - sigma^2)
    kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    
    # Beta-VAE: beta > 1 encourages more disentangled representations
    return recon_loss + beta * kl_loss`
      }
    ]
  },
  {
    id: 8,
    slug: "gans",
    title: "Generative Adversarial Networks (GANs)",
    category: "Core Models",
    difficulty: "Intermediate",
    readTime: 14,
    description: "Generator vs discriminator, adversarial training, mode collapse, training instability, and GAN variants.",
    relatedSlugs: ["vaes", "diffusion-models", "neural-networks-basics"],
    sections: [
      {
        title: "The Adversarial Framework",
        content: `GANs, introduced by Ian Goodfellow et al. in 2014, are one of the most creative ideas in machine learning. The setup: two neural networks compete in a game.

The Generator G takes random noise z ~ p(z) and produces fake data G(z). Its goal is to produce samples so realistic that the discriminator can't tell they're fake.

The Discriminator D takes an input (real or fake) and outputs a probability that the input is real. Its goal is to correctly distinguish real data from fake.

These two networks are trained simultaneously in a minimax game: G tries to maximize the probability of D making a mistake; D tries to minimize it. In theory, this game reaches a Nash equilibrium where G has learned the true data distribution and D can do no better than random guessing.`
      },
      {
        title: "Training Dynamics",
        content: `The training procedure alternates:
1. Train D: Show D real examples (label=1) and fake examples from G (label=0). Update D to improve classification.
2. Train G: Generate fakes, pass through D, and update G to maximize D's error on these fakes.

The generator never sees real data directly. It only gets feedback through the discriminator's gradients. This indirect signal is both elegant and challenging.

The loss functions:
- Discriminator: L_D = -E[log D(x)] - E[log(1 - D(G(z)))]  (maximize this)
- Generator: L_G = -E[log D(G(z))]  (minimize this, equivalent to maximizing log D(G(z)))`,
        code: `import torch
import torch.nn as nn

def train_gan_step(generator, discriminator, real_data, optimizer_G, optimizer_D, z_dim):
    batch_size = real_data.size(0)
    real_labels = torch.ones(batch_size, 1)
    fake_labels = torch.zeros(batch_size, 1)
    criterion = nn.BCELoss()
    
    # --- Train Discriminator ---
    optimizer_D.zero_grad()
    # Real data
    real_pred = discriminator(real_data)
    d_loss_real = criterion(real_pred, real_labels)
    # Fake data
    z = torch.randn(batch_size, z_dim)
    fake_data = generator(z).detach()  # detach to not backprop into G
    fake_pred = discriminator(fake_data)
    d_loss_fake = criterion(fake_pred, fake_labels)
    d_loss = d_loss_real + d_loss_fake
    d_loss.backward()
    optimizer_D.step()
    
    # --- Train Generator ---
    optimizer_G.zero_grad()
    z = torch.randn(batch_size, z_dim)
    fake_data = generator(z)
    fake_pred = discriminator(fake_data)
    # G wants D to think fakes are real
    g_loss = criterion(fake_pred, real_labels)
    g_loss.backward()
    optimizer_G.step()
    
    return d_loss.item(), g_loss.item()`
      },
      {
        title: "Mode Collapse and Training Instability",
        content: `GANs are notoriously difficult to train. The two main pathologies:

Mode Collapse: The generator learns to produce only a few types of outputs (modes), ignoring the diversity of the training data. Imagine a GAN trained on faces that only generates one person's face — technically fooling the discriminator for those examples, but failing to capture the distribution.

Training Instability: The generator and discriminator can fall out of balance. If the discriminator becomes too good, the generator receives near-zero gradients and can't learn. If the generator gets ahead, the discriminator provides poor feedback.

The Wasserstein GAN (WGAN) addresses instability by replacing the discriminator with a "critic" that estimates the Wasserstein distance between real and fake distributions. This provides more useful gradients even when distributions don't overlap.

Spectral normalization, gradient penalty (WGAN-GP), and minibatch discrimination are other techniques that stabilize training.`
      },
      {
        title: "Notable GAN Architectures",
        content: `The original GAN paper spawned hundreds of variants:

DCGAN (Deep Convolutional GAN): Used convolutional layers for image generation. Established architectural best practices that made GANs more stable.

StyleGAN and StyleGAN2: NVIDIA's architecture for high-quality face generation. Introduced style-based generation with adaptive instance normalization, enabling fine-grained control over image attributes.

BigGAN: Scaled up GAN training with class-conditional generation. Produced stunning ImageNet samples.

CycleGAN: Learned to translate between two image domains (e.g., horse → zebra, summer → winter) without paired training examples, using cycle-consistency loss.

Pix2Pix: Conditional GAN for image-to-image translation with paired training data. Widely used for sketch → photo, map → satellite, etc.

GAN applications peaked around 2019–2021. Since then, diffusion models have largely superseded GANs for image generation due to better training stability and output quality.`
      }
    ]
  },
  {
    id: 9,
    slug: "diffusion-models",
    title: "Diffusion Models",
    category: "Core Models",
    difficulty: "Intermediate",
    readTime: 16,
    description: "Forward diffusion, reverse diffusion, DDPM, score matching, and noise schedules — the architecture behind Stable Diffusion and DALL-E.",
    relatedSlugs: ["gans", "vaes", "image-generation", "classifier-free-guidance"],
    sections: [
      {
        title: "The Core Idea: Learning to Denoise",
        content: `Diffusion models are inspired by non-equilibrium thermodynamics. The core intuition: if you gradually add noise to an image until it becomes pure Gaussian noise, and then learn to reverse that process step by step, you have a powerful generative model.

The forward process (diffusion) takes real data x₀ and gradually corrupts it over T steps, adding a small amount of Gaussian noise at each step. After enough steps, the data has become indistinguishable from pure noise.

The reverse process (denoising) learns to undo this corruption. Given noisy data xₜ at step t, predict the noise that was added (or equivalently, predict the less-noisy version xₜ₋₁). Repeating this from T down to 0 generates a sample from the learned data distribution.

The model that performs this denoising is typically a U-Net — a convolutional network with skip connections that can process images at multiple scales.`
      },
      {
        title: "The Forward Process",
        content: `The forward process is defined as a Markov chain:
q(xₜ | xₜ₋₁) = N(xₜ; √(1-βₜ) xₜ₋₁, βₜ I)

where βₜ is a small positive constant (the noise schedule). Each step adds a small amount of Gaussian noise, scaled to preserve the signal.

A useful property: we can jump directly from x₀ to xₜ without computing all intermediate steps:
q(xₜ | x₀) = N(xₜ; √ᾱₜ x₀, (1-ᾱₜ) I)

where ᾱₜ = ∏ᵢ₌₁ᵗ (1-βᵢ). This means we can sample noisy versions of any image at any timestep directly during training.`,
        code: `import torch
import numpy as np

def get_noise_schedule(T, beta_start=1e-4, beta_end=0.02):
    """Linear noise schedule."""
    betas = torch.linspace(beta_start, beta_end, T)
    alphas = 1 - betas
    alphas_cumprod = torch.cumprod(alphas, dim=0)
    return betas, alphas_cumprod

def add_noise(x0, t, alphas_cumprod):
    """Add noise to x0 at timestep t (forward process shortcut)."""
    sqrt_alpha = alphas_cumprod[t].sqrt().view(-1, 1, 1, 1)
    sqrt_one_minus = (1 - alphas_cumprod[t]).sqrt().view(-1, 1, 1, 1)
    noise = torch.randn_like(x0)
    xt = sqrt_alpha * x0 + sqrt_one_minus * noise
    return xt, noise`
      },
      {
        title: "The Reverse Process and Training",
        content: `The reverse process learns to denoise. We train a neural network εθ(xₜ, t) to predict the noise ε that was added to x₀ to get xₜ.

Training objective (simplified DDPM loss):
L = E[||ε - εθ(√ᾱₜ x₀ + √(1-ᾱₜ) ε, t)||²]

1. Sample a training image x₀
2. Sample a timestep t uniformly from {1, ..., T}
3. Sample noise ε ~ N(0, I)
4. Compute noisy image: xₜ = √ᾱₜ x₀ + √(1-ᾱₜ) ε
5. Predict noise: ε̂ = εθ(xₜ, t)
6. Loss: ||ε - ε̂||²

During generation, we start from pure noise xT ~ N(0, I) and iteratively apply the learned reverse process, using the noise prediction to estimate the slightly less-noisy xₜ₋₁.`
      },
      {
        title: "Noise Schedules and Improvements",
        content: `The noise schedule βₜ controls how quickly the signal is destroyed in the forward process. The original DDPM used a linear schedule. Ho et al. found a cosine schedule works better, preserving more signal at early timesteps.

DDIM (Denoising Diffusion Implicit Models) reformulated diffusion sampling as a deterministic process, enabling 10–50× fewer sampling steps without retraining. This is why you can generate an image in 20 steps instead of 1000.

Latent Diffusion Models (LDM): Instead of diffusing in pixel space, apply diffusion in the latent space of a pre-trained autoencoder. This reduces computational cost dramatically. Stable Diffusion is a latent diffusion model — it generates 64×64 latent codes that are decoded to 512×512 images.

Score matching provides an alternative theoretical framework for diffusion models based on estimating the score function (gradient of log probability density). Song et al.'s score-based generative models unified many approaches under this framework.`
      }
    ]
  },
  {
    id: 10,
    slug: "transformers",
    title: "Transformers",
    category: "Core Models",
    difficulty: "Intermediate",
    readTime: 18,
    description: "Attention mechanism, self-attention, multi-head attention, positional encoding, and the full encoder-decoder architecture.",
    relatedSlugs: ["large-language-models", "neural-networks-basics", "embeddings"],
    sections: [
      {
        title: "Why Transformers? The Problem with RNNs",
        content: `Before transformers, recurrent neural networks (RNNs) and their variants (LSTMs, GRUs) were the dominant architecture for sequence tasks. They process sequences step-by-step, maintaining a hidden state that accumulates information from previous steps.

RNNs have two fundamental limitations: they're sequential (step t can't start until step t-1 finishes, preventing parallelization), and they struggle with long-range dependencies (information from many steps ago tends to wash out in the hidden state).

The transformer architecture, introduced in "Attention Is All You Need" (Vaswani et al., 2017), addresses both problems. It processes all positions in a sequence simultaneously (highly parallelizable) and uses attention to directly connect any two positions, regardless of distance.`
      },
      {
        title: "The Attention Mechanism",
        content: `Attention allows the model to focus on relevant parts of the input when processing each position. The key insight: when processing the word "it" in "The animal didn't cross the street because it was tired," attention can look back and determine that "it" refers to "animal."

The scaled dot-product attention computes:
Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V

Where:
- Q (Queries): What are we looking for?
- K (Keys): What does each position offer?
- V (Values): What information does each position contain?
- dₖ: Dimension of keys (used for scaling to prevent vanishing gradients with large dimensions)

The dot product QKᵀ computes similarity scores between each query and all keys. Softmax normalizes these to weights that sum to 1. The output is a weighted sum of Values — positions with high similarity to the query contribute more.`,
        code: `import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: (batch, heads, seq_len_q, d_k)
    K: (batch, heads, seq_len_k, d_k)  
    V: (batch, heads, seq_len_k, d_v)
    """
    d_k = Q.size(-1)
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    # Apply mask (e.g., causal mask for autoregressive generation)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    # Normalize to probabilities
    attn_weights = F.softmax(scores, dim=-1)
    
    # Weighted sum of values
    output = torch.matmul(attn_weights, V)
    return output, attn_weights`
      },
      {
        title: "Multi-Head Attention",
        content: `A single attention head captures one type of relationship. Multi-head attention runs several attention operations in parallel, allowing the model to attend to different aspects simultaneously — one head might track syntactic dependencies, another semantic relationships, another co-reference.

The implementation: project Q, K, V into h smaller subspaces (using learned linear projections), apply attention in each subspace independently, then concatenate and project back.

MultiHead(Q, K, V) = Concat(head₁, ..., headₕ) Wᴼ
where headᵢ = Attention(QWᵢQ, KWᵢK, VWᵢV)

The projections are learned — each head focuses on different subspaces of the input representation.`
      },
      {
        title: "Positional Encoding",
        content: `Since attention is permutation-equivariant (it doesn't inherently care about position), we need to inject position information. Original transformers used sinusoidal positional encodings:

PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

These deterministic encodings have nice properties: each position gets a unique encoding, and the model can extrapolate to longer sequences. They're added to the token embeddings before the first layer.

Modern LLMs use learned positional embeddings or rotary positional embeddings (RoPE) — the latter encodes relative positions in the attention computation itself, enabling better generalization to longer sequences than seen during training.`
      },
      {
        title: "Encoder, Decoder, and Variants",
        content: `The original transformer had two components:

Encoder: Processes the input sequence bidirectionally (each position attends to all others). Used for understanding tasks. BERT is an encoder-only transformer.

Decoder: Generates the output sequence autoregressively. Uses masked self-attention (causal masking prevents positions from attending to future positions) and cross-attention to the encoder. The original GPT is decoder-only.

Encoder-decoder: Used for seq2seq tasks like translation. The encoder processes the source, the decoder generates the target while attending to the encoder output via cross-attention.

GPT and most modern LLMs are decoder-only: they predict the next token based on all previous tokens. This causal structure naturally supports both generation (sampling next tokens) and conditional generation (continuing from a prompt).`
      }
    ]
  },
  {
    id: 11,
    slug: "large-language-models",
    title: "Large Language Models (LLMs)",
    category: "Core Models",
    difficulty: "Intermediate",
    readTime: 16,
    description: "GPT architecture, autoregressive generation, tokenization, context windows, and what makes LLMs work at scale.",
    relatedSlugs: ["transformers", "prompt-engineering", "rlhf", "scaling-laws"],
    sections: [
      {
        title: "What Makes a Language Model 'Large'?",
        content: `A language model is any model that assigns probabilities to sequences of text. Large Language Models (LLMs) are language models with billions of parameters trained on massive datasets — hundreds of billions to trillions of tokens from internet text, books, code, and other sources.

The "large" matters for a surprising reason: capability appears to emerge at scale. Smaller models can do pattern matching; larger models develop qualitatively new abilities — reasoning, code synthesis, multi-step problem solving — that weren't explicitly trained.

Key scale indicators:
- GPT-2 (2019): 1.5B parameters
- GPT-3 (2020): 175B parameters  
- GPT-4 (2023): ~1.8T parameters (estimated, MoE)
- Llama 3.1 (2024): 405B parameters (open source)`
      },
      {
        title: "Tokenization",
        content: `LLMs don't operate on characters or words — they operate on tokens. A tokenizer splits text into sub-word units that balance vocabulary size with coverage.

GPT models use Byte Pair Encoding (BPE): start with individual bytes, then repeatedly merge the most common adjacent pairs until the vocabulary reaches a target size (typically 50,000–100,000 tokens). Common words become single tokens ("hello" → [hello]); rare words get split ("tokenization" → ["token", "ization"]).

Why not just use words? A word vocabulary would have millions of entries, many appearing too rarely to learn well. Why not bytes/characters? Each sequence becomes very long, straining the context window.

Tokens aren't always intuitive. Numbers often get split: "1234" might be ["12", "34"]. Different tokenizers handle code, math, and non-English text differently — this matters for model performance on these domains.`,
        code: `# Demonstrating BPE tokenization with tiktoken (OpenAI's library)
import tiktoken

enc = tiktoken.get_encoding("cl100k_base")  # GPT-4 tokenizer

text = "Tokenization splits text into sub-word units."
tokens = enc.encode(text)
print(f"Tokens: {tokens}")
print(f"Count: {len(tokens)}")

# Decode back
decoded = enc.decode(tokens)
print(f"Decoded: {decoded}")

# Token boundaries
for token_id in tokens:
    print(repr(enc.decode([token_id])), end=" ")`
      },
      {
        title: "Autoregressive Generation",
        content: `LLMs generate text one token at a time, left to right. At each step, the model computes a probability distribution over the entire vocabulary given all previous tokens, then samples the next token from that distribution.

P(x₁, x₂, ..., xₙ) = ∏ᵢ P(xᵢ | x₁, ..., xᵢ₋₁)

This is the "chain rule of probability" — the joint probability of a sequence decomposes into a product of conditional probabilities.

Training: Given a sequence, predict each next token from all previous tokens. The loss is cross-entropy between predicted and actual next tokens. This simple objective, applied to massive text corpora, is the recipe for LLM capability.

The model uses masked self-attention during training — position i can only attend to positions 1...i, preventing it from "cheating" by looking ahead.`
      },
      {
        title: "Context Windows",
        content: `The context window is the maximum number of tokens the model can process at once. Early LLMs had context windows of 2K tokens; modern models extend to 128K, 200K, or even 1M+ tokens.

Larger context windows are important for: processing long documents, maintaining coherence in long conversations, analyzing entire codebases, and multi-document reasoning.

The computational cost of attention scales quadratically with sequence length (O(n²)), making longer contexts expensive. Techniques like Flash Attention implement attention more memory-efficiently, reducing the constant factor. Sparse attention, linear attention, and state-space models (Mamba) propose alternatives to standard attention that scale more favorably.

In practice, even models with large context windows often perform worse at the middle of long contexts — they're better at the beginning and end. This "lost in the middle" phenomenon is an active area of research.`
      }
    ]
  },
  {
    id: 12,
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    category: "Techniques",
    difficulty: "Intermediate",
    readTime: 12,
    description: "Zero-shot, few-shot, chain-of-thought prompting, system prompts, and the art of communicating with LLMs.",
    relatedSlugs: ["large-language-models", "fine-tuning", "rlhf"],
    sections: [
      {
        title: "What is Prompt Engineering?",
        content: `Prompt engineering is the practice of designing inputs to language models to reliably elicit desired outputs. Since LLMs are extremely sensitive to how a task is framed, careful prompt design can dramatically improve performance — often without any fine-tuning.

The core insight: an LLM is a conditional probability model. Given a prompt P, it generates the most likely continuation. Your prompt shifts the probability distribution over completions — a well-crafted prompt makes the distribution peak at correct, helpful responses.

Prompt engineering is part art, part science. It requires understanding how the model was trained, what patterns it saw, and how to activate relevant "circuits" in the model.`
      },
      {
        title: "Zero-Shot and Few-Shot Prompting",
        content: `Zero-shot prompting: Simply describe the task and let the model solve it.
"Translate the following English text to French: 'Hello, how are you?'"

The model generalizes from its training. This works well for common tasks but may fail for specialized or unusual ones.

Few-shot prompting: Provide a few examples of the task before asking the model to solve a new instance.

"Classify the sentiment of the following reviews:
Review: 'The food was amazing!' → Positive
Review: 'Service was terrible.' → Negative
Review: 'Nothing special, just okay.' → ?"

The model learns the pattern from examples and applies it to the new input. Few-shot prompting can dramatically improve performance on tasks the model hasn't seen before, without any weight updates — this is "in-context learning."`
      },
      {
        title: "Chain-of-Thought Prompting",
        content: `Chain-of-Thought (CoT) prompting asks the model to reason step by step before giving a final answer. This dramatically improves performance on multi-step reasoning tasks.

Standard prompt: "If a train travels at 60mph for 2 hours, how far does it go?"
CoT prompt: "If a train travels at 60mph for 2 hours, how far does it go? Let's think step by step."

The model responds: "The train travels at 60 mph. It travels for 2 hours. Distance = speed × time = 60 × 2 = 120 miles. The answer is 120 miles."

Why does this work? By generating intermediate reasoning steps, the model effectively gives itself more "compute" per answer. The reasoning steps also act as a scratchpad, allowing errors to be caught and corrected before the final answer.

Zero-shot CoT adds "Let's think step by step" to any prompt. Few-shot CoT includes worked examples with reasoning traces.`
      },
      {
        title: "System Prompts and Instruction Following",
        content: `Modern chat models accept a system prompt — a high-level set of instructions that shape the model's behavior throughout the conversation. System prompts can:
- Define the model's persona and tone
- Specify response format (JSON, markdown, etc.)
- Provide domain-specific context
- Set boundaries on topics to discuss or avoid

Instruction-following LLMs (fine-tuned with RLHF) are particularly responsive to clear, explicit instructions. Vague instructions produce vague results; specific instructions produce specific results.

Advanced techniques:
Structured outputs: Ask the model to respond in JSON or XML with a specific schema, then parse the output programmatically.
Role prompting: Assign a specific role ("You are an expert in tax law...") to activate domain-specific knowledge.
Delimiters: Use XML tags, triple backticks, or other delimiters to clearly separate prompt sections and prevent prompt injection.
Verification prompts: Ask the model to check its own work ("Review your answer. Is it correct?").`
      }
    ]
  },
  {
    id: 13,
    slug: "fine-tuning",
    title: "Fine-tuning LLMs",
    category: "Techniques",
    difficulty: "Intermediate",
    readTime: 11,
    description: "Full fine-tuning, task-specific datasets, catastrophic forgetting, and best practices for adapting LLMs.",
    relatedSlugs: ["large-language-models", "lora", "rlhf", "prompt-engineering"],
    sections: [
      {
        title: "Why Fine-tune?",
        content: `Pre-trained LLMs are general-purpose — they know a lot about everything. Fine-tuning adapts them to specific tasks or domains, improving performance beyond what prompt engineering alone can achieve.

Use cases for fine-tuning:
- Domain adaptation: A model fine-tuned on medical records performs better on clinical NLP tasks
- Style adaptation: Fine-tuning on a company's communications ensures consistent tone
- Instruction following: Teaching models to follow specific formats or workflows
- Task specialization: A code-focused model fine-tuned on Python performs better on Python tasks

The trade-off: fine-tuning requires labeled data, compute, and expertise. Before fine-tuning, always try prompt engineering — it's often sufficient.`
      },
      {
        title: "Instruction Fine-tuning",
        content: `The most common fine-tuning paradigm for chat models: train on (instruction, response) pairs where the response demonstrates the desired behavior.

Training data format:
System: You are a helpful assistant.
User: Explain quantum computing simply.
Assistant: [ideal response]

The model learns to follow instructions by seeing thousands of examples of good instruction-following behavior. This is how GPT-3 became InstructGPT, and how most chat models are trained today.

Datasets: Alpaca (52K instructions), ShareGPT (human-GPT conversations), Open-Platypus, Dolly, and many others. Quality matters more than quantity — a few thousand high-quality examples can be more valuable than millions of mediocre ones.`
      },
      {
        title: "Catastrophic Forgetting",
        content: `Catastrophic forgetting is a fundamental challenge: when fine-tuning a pre-trained model on a new task, the model tends to forget what it learned during pre-training.

The problem is especially acute when fine-tuning data is limited or very different from pre-training data. The model "overwrites" general knowledge to memorize the fine-tuning task.

Mitigation strategies:
- Low learning rate: Fine-tune with a learning rate 10-100× smaller than pre-training
- Early stopping: Stop before the model memorizes the fine-tuning data
- Regularization: Add L2 regularization or use techniques like Elastic Weight Consolidation (EWC)
- Data mixing: Mix a small amount of pre-training data into fine-tuning data
- LoRA and adapters: Fine-tune only a small subset of parameters (see the LoRA topic)

Modern best practice usually involves parameter-efficient fine-tuning (PEFT) methods precisely because they avoid modifying most weights, naturally limiting catastrophic forgetting.`
      }
    ]
  },
  {
    id: 14,
    slug: "lora",
    title: "LoRA & Parameter-Efficient Fine-tuning",
    category: "Techniques",
    difficulty: "Intermediate",
    readTime: 13,
    description: "Low-rank adaptation, the math behind LoRA, QLoRA, adapters, and how to fine-tune LLMs on consumer hardware.",
    relatedSlugs: ["fine-tuning", "large-language-models", "quantization"],
    sections: [
      {
        title: "The Problem: Full Fine-tuning is Expensive",
        content: `Full fine-tuning updates all model parameters. For a 7B parameter model in fp16, just storing the parameters takes 14GB of GPU memory. Add gradients (14GB) and optimizer state (28GB for Adam), and you need 56GB+ of GPU memory — a multi-GPU setup required.

Parameter-Efficient Fine-Tuning (PEFT) methods update only a small fraction of parameters, dramatically reducing memory and compute requirements. They achieve performance close to full fine-tuning at a fraction of the cost.

Key PEFT approaches: LoRA, prefix tuning, prompt tuning, and adapter layers. LoRA has become the dominant approach due to its simplicity and effectiveness.`
      },
      {
        title: "The LoRA Idea",
        content: `LoRA (Low-Rank Adaptation) is based on a key observation: the weight updates during fine-tuning have low intrinsic rank. The weight matrix changes ΔW can be decomposed into two small matrices: ΔW = AB, where A ∈ ℝ^(d×r) and B ∈ ℝ^(r×k), with r << min(d, k).

Instead of updating W directly, LoRA keeps the pre-trained weights W₀ frozen and adds trainable low-rank matrices:
h = W₀x + BAx = (W₀ + BA)x

During training, only A and B are updated. Since r is small (typically 4–64), the number of trainable parameters is tiny. For a 4096×4096 attention weight matrix with r=16: W has 16M parameters, BA has 2×4096×16=131K parameters — 120× fewer.

The rank r is a hyperparameter controlling the expressivity-efficiency trade-off. Higher r → more expressive but more parameters. Lower r → more efficient but potentially less expressive.`,
        code: `import torch
import torch.nn as nn

class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, rank=16, alpha=32):
        super().__init__()
        # Pre-trained weights — frozen
        self.weight = nn.Parameter(
            torch.randn(out_features, in_features), requires_grad=False
        )
        # LoRA matrices — trainable
        self.lora_A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))
        self.scale = alpha / rank  # scaling factor

    def forward(self, x):
        # Original + LoRA update
        return (x @ self.weight.T) + self.scale * (x @ self.lora_A.T @ self.lora_B.T)`
      },
      {
        title: "QLoRA: Fine-tuning at 4-bit",
        content: `QLoRA (Quantized LoRA) combines quantization with LoRA to enable fine-tuning of large models on consumer hardware. The recipe:

1. Load the pre-trained model in 4-bit precision (NF4 — Normal Float 4, a data type optimized for weights that follow a normal distribution)
2. Freeze the quantized weights
3. Add LoRA adapters in 16-bit precision
4. Train only the LoRA adapters

With QLoRA, a 65B parameter LLaMA model can be fine-tuned on a single 48GB GPU — something that would require multiple 80GB A100s with full fine-tuning. A 7B model can be fine-tuned on a consumer GPU with 12-16GB VRAM.

The key insight: quantized weights introduce small errors, but since we're fine-tuning (not training from scratch), the pre-trained weights are already good. The LoRA adapters compensate for any degradation from quantization.`
      }
    ]
  },
  {
    id: 15,
    slug: "rag",
    title: "Retrieval-Augmented Generation (RAG)",
    category: "Techniques",
    difficulty: "Intermediate",
    readTime: 13,
    description: "Vector databases, embeddings, chunking strategies, and building RAG pipelines that ground LLMs in external knowledge.",
    relatedSlugs: ["embeddings", "large-language-models", "prompt-engineering"],
    sections: [
      {
        title: "The Problem RAG Solves",
        content: `LLMs have two fundamental limitations for knowledge-intensive applications: their knowledge is frozen at training time (they don't know about recent events), and they can hallucinate facts, especially about specific details.

Retrieval-Augmented Generation (RAG) addresses both by connecting the LLM to an external knowledge base. When a user asks a question, the system retrieves relevant documents and provides them as context to the LLM, which then synthesizes an answer grounded in the retrieved information.

RAG enables: answering questions about documents never seen during training, maintaining up-to-date knowledge without retraining, and providing citations to support answers.`
      },
      {
        title: "The RAG Pipeline",
        content: `A RAG pipeline has two phases:

Indexing (offline):
1. Collect documents (PDFs, web pages, database records, etc.)
2. Chunk them into segments (paragraphs, fixed-size chunks, or semantic units)
3. Embed each chunk using an embedding model — convert text to a dense vector
4. Store vectors in a vector database (Pinecone, Weaviate, Chroma, pgvector)

Retrieval + Generation (online, per query):
1. Embed the user's query using the same embedding model
2. Find the most similar chunk vectors using approximate nearest neighbor search
3. Retrieve the corresponding text chunks
4. Construct a prompt: "Context: [retrieved chunks] \n\n Question: [user query] \n\n Answer:"
5. Send to LLM and return the generated answer`
      },
      {
        title: "Chunking Strategies",
        content: `How you split documents dramatically affects retrieval quality.

Fixed-size chunking: Split every N tokens (e.g., 512). Simple but may cut mid-sentence or mid-concept.

Overlap: Include some overlap between adjacent chunks (e.g., 50-token overlap) so context isn't completely lost at boundaries.

Semantic chunking: Split at semantic boundaries (paragraphs, sections, sentences). Preserves meaning better.

Hierarchical chunking: Maintain both small chunks (for precise retrieval) and larger parent chunks (for context). Retrieve small chunks, return parent chunks to the LLM.

The optimal chunk size depends on: the embedding model's context window, document structure, and query nature. Longer chunks provide more context but may dilute the relevant information with noise.`
      },
      {
        title: "Advanced RAG Techniques",
        content: `Basic RAG has limitations. Advanced techniques address common failure modes:

Query rewriting: Use an LLM to rewrite the user's query before retrieval to make it more suitable for vector search.

HyDE (Hypothetical Document Embeddings): Generate a hypothetical ideal answer, embed that, and use it for retrieval. Often retrieves better than embedding the original query.

Re-ranking: After initial retrieval with approximate nearest neighbors, use a cross-encoder re-ranker to more precisely score document-query relevance.

Multi-query retrieval: Generate multiple query variants, retrieve for each, and merge results. Catches documents that any single query might miss.

Self-RAG: Train the LLM to decide when retrieval is needed and how to use retrieved results, rather than always retrieving.

Agentic RAG: Let an agent iteratively refine queries and retrieve additional information when needed, rather than doing a single retrieval pass.`
      }
    ]
  },
  {
    id: 16,
    slug: "embeddings",
    title: "Embeddings & Vector Search",
    category: "Techniques",
    difficulty: "Intermediate",
    readTime: 11,
    description: "Word2vec, sentence embeddings, cosine similarity, FAISS, and vector databases — representing meaning as geometry.",
    relatedSlugs: ["rag", "transformers", "large-language-models"],
    sections: [
      {
        title: "What are Embeddings?",
        content: `An embedding is a dense vector representation of an object (word, sentence, image, etc.) in a continuous vector space where semantically similar objects are geometrically close.

The power of embeddings: semantic meaning becomes geometric distance. "King" - "Man" + "Woman" ≈ "Queen" — the famous word2vec result showing that relationships are encoded as vector arithmetic.

Why this matters for GenAI: embeddings enable semantic search (find documents related in meaning, not just keywords), cross-modal matching (match images to text descriptions), clustering (group similar documents), and retrieval for RAG systems.`
      },
      {
        title: "From Word2Vec to Sentence Embeddings",
        content: `Word2Vec (Mikolov et al., 2013) was the breakthrough: predict context words from a center word (skip-gram) or predict a center word from context (CBOW). This simple training objective produces vectors where semantically similar words cluster together.

GloVe (Global Vectors): Similar to Word2Vec but leverages global co-occurrence statistics across the entire corpus.

Both produce word-level embeddings. For sentences and documents, you need more. BERT-based sentence embeddings (Sentence-BERT, using contrastive learning) produce fixed-size sentence vectors where semantically similar sentences are close.

Modern embedding models (OpenAI's text-embedding-3, Cohere Embed, E5, BGE) are trained on massive datasets with contrastive objectives, producing high-quality embeddings for retrieval and search at various vector dimensions (768, 1536, 3072).`
      },
      {
        title: "Similarity and Vector Search",
        content: `Given two embedding vectors, cosine similarity measures the angle between them:

cos(θ) = (A · B) / (||A|| × ||B||)

Values range from -1 (opposite) to 1 (identical direction). For semantic similarity, 0.8+ typically indicates high relevance.

Naive search: compute cosine similarity between the query vector and every vector in the database. This is exact but O(n) — impractical for millions of vectors.

Approximate Nearest Neighbor (ANN) search: Use indexing structures to find approximately nearest neighbors in sublinear time.

FAISS (Facebook AI Similarity Search): High-performance C++ library for ANN search. Multiple index types: IVF (inverted file, partitions space into clusters), HNSW (hierarchical navigable small world graphs), PQ (product quantization for compression).

Vector databases (Pinecone, Weaviate, Chroma, Qdrant, Milvus, pgvector) package ANN search with features like metadata filtering, real-time updates, and managed infrastructure.`,
        code: `import faiss
import numpy as np

# Create a random index of 100,000 vectors (dim=1536)
d = 1536          # dimension
n = 100_000       # number of vectors

# Build HNSW index (good balance of speed/accuracy)
index = faiss.IndexHNSWFlat(d, 32)  # 32 = number of connections per node
vectors = np.random.rand(n, d).astype('float32')
index.add(vectors)

# Search: find 5 nearest neighbors for a query
query = np.random.rand(1, d).astype('float32')
distances, indices = index.search(query, k=5)

print(f"Nearest neighbors: {indices[0]}")
print(f"Distances: {distances[0]}")`
      }
    ]
  },
  {
    id: 17,
    slug: "rlhf",
    title: "Reinforcement Learning from Human Feedback (RLHF)",
    category: "Techniques",
    difficulty: "Advanced",
    readTime: 14,
    description: "Reward modeling, Proximal Policy Optimization (PPO), preference data, and how RLHF aligns LLMs with human values.",
    relatedSlugs: ["large-language-models", "fine-tuning", "constitutional-ai"],
    sections: [
      {
        title: "Why RLHF?",
        content: `Pre-trained LLMs optimize for predicting text from the internet. Internet text includes misinformation, harmful content, and bad reasoning — and a model trained to predict it will reproduce these patterns.

Fine-tuning on instruction-following datasets helps, but the model still doesn't have a notion of what humans actually prefer. Two responses might both be grammatically correct and factually plausible, but one is clearly more helpful, safer, or better formatted.

RLHF teaches models to produce responses humans prefer, using human feedback as the training signal. It's the technique that transformed GPT-3 into InstructGPT and, subsequently, into ChatGPT.`
      },
      {
        title: "The Three Steps of RLHF",
        content: `Step 1 — Supervised Fine-Tuning (SFT): Fine-tune the base LLM on a curated dataset of high-quality instruction-following examples. This gives the model basic instruction-following behavior before RL training begins.

Step 2 — Reward Model Training: Collect human preferences. Show human labelers two responses to the same prompt and ask which is better. Train a reward model (also a transformer) to predict which response humans prefer. The reward model scores any response as a scalar value.

Step 3 — RL Training (PPO): Use the reward model as a "critic" and fine-tune the LLM (the "policy") using Proximal Policy Optimization. The LLM generates responses, the reward model scores them, and PPO updates the LLM's weights to produce higher-scoring responses.

A KL divergence penalty prevents the RL-tuned model from drifting too far from the SFT model — this prevents reward hacking (gaming the reward model in unexpected ways).`
      },
      {
        title: "PPO and the RL Objective",
        content: `Proximal Policy Optimization (PPO) is an actor-critic RL algorithm chosen for RLHF because it's relatively stable and sample-efficient.

The full RLHF objective:
maximize: E[R(x, y)] - β × D_KL(π_θ(y|x) || π_ref(y|x))

Where:
- R(x, y) is the reward model score for response y to prompt x
- π_θ is the current policy (LLM being fine-tuned)
- π_ref is the reference policy (the SFT model)
- β is the KL penalty coefficient (typically 0.1–0.2)

The KL penalty ensures the LLM doesn't become unrecognizable from the SFT baseline while optimizing the reward. Without it, the model can find degenerate strategies — like repeating a single high-reward phrase — that technically maximize the reward model but produce terrible outputs.`
      },
      {
        title: "Alternatives: DPO and RLAIF",
        content: `PPO-based RLHF is computationally expensive (requires running multiple models simultaneously) and tricky to tune. Alternatives have emerged:

DPO (Direct Preference Optimization): Directly optimizes the LLM on preference data without training a separate reward model or running RL. DPO reframes RLHF as a classification problem, making it much simpler to implement. Most modern fine-tuning pipelines use DPO instead of PPO.

RLAIF (RL from AI Feedback): Instead of expensive human labelers, use a powerful LLM (like Claude or GPT-4) to generate preference labels. Constitutional AI (Anthropic) uses this approach with a set of principles (the "constitution") guiding the AI judge.

IPO, ORPO, SimPO: Various further simplifications and improvements to preference optimization, still an active research area.`
      }
    ]
  },
  {
    id: 18,
    slug: "sampling-strategies",
    title: "Sampling Strategies",
    category: "Techniques",
    difficulty: "Intermediate",
    readTime: 9,
    description: "Temperature, top-k, top-p (nucleus sampling), beam search, and greedy decoding — how LLMs choose their next token.",
    relatedSlugs: ["large-language-models", "prompt-engineering", "classifier-free-guidance"],
    sections: [
      {
        title: "The Decoding Problem",
        content: `At each step, an LLM produces a probability distribution over its entire vocabulary (50,000–100,000 tokens). How do you select the next token? This is the decoding problem, and the choice dramatically affects output quality, diversity, and coherence.

The optimal strategy depends on the task. Creative writing benefits from diversity (some randomness). Coding and factual Q&A benefit from determinism (always pick the most likely token). Different strategies make different trade-offs.`
      },
      {
        title: "Greedy Decoding and Beam Search",
        content: `Greedy Decoding: At each step, pick the single most probable token. Simple and fast, but often produces repetitive or suboptimal sequences because locally optimal choices may not be globally optimal.

Beam Search: Keep track of the k most likely partial sequences ("beams") at each step and expand all of them. After the full sequence is generated, return the beam with the highest overall probability.

Beam search was the standard for machine translation. For open-ended generation, it tends to produce generic, safe, often repetitive text — the beam search paradox: maximizing probability doesn't maximize quality.`,
        code: `import torch
import torch.nn.functional as F

def greedy_decode(model, input_ids, max_new_tokens=50):
    generated = input_ids.clone()
    for _ in range(max_new_tokens):
        with torch.no_grad():
            logits = model(generated).logits[:, -1, :]  # last position
        next_token = logits.argmax(dim=-1, keepdim=True)
        generated = torch.cat([generated, next_token], dim=-1)
        if next_token.item() == model.config.eos_token_id:
            break
    return generated`
      },
      {
        title: "Temperature and Stochastic Sampling",
        content: `Temperature sampling divides the logits by a temperature T before applying softmax:
p(xᵢ) = softmax(logits / T)

T < 1.0: Sharpens the distribution — high probability tokens become even more likely. More deterministic, lower diversity.
T = 1.0: Original distribution.
T > 1.0: Flattens the distribution — probabilities become more equal. More random, higher diversity.
T → 0: Greedy decoding.
T → ∞: Uniform random sampling.

Top-k sampling: After applying temperature, zero out all but the k highest probability tokens and renormalize. Prevents sampling from the long tail of unlikely tokens. k=50 is a common default.

Top-p (Nucleus) sampling: Instead of a fixed k, include the smallest set of tokens whose cumulative probability exceeds p (e.g., p=0.9). This is adaptive — if the distribution is peaked, few tokens are included; if flat, many are. Usually preferred over top-k.

Typical defaults for creative generation: temperature=0.7–1.0, top-p=0.9–0.95. For factual Q&A: temperature=0 (greedy).`
      }
    ]
  },
  {
    id: 19,
    slug: "image-generation",
    title: "Image Generation",
    category: "Applications",
    difficulty: "Intermediate",
    readTime: 12,
    description: "Text-to-image, Stable Diffusion, DALL-E, Midjourney, inpainting, outpainting, and the state of AI image generation.",
    relatedSlugs: ["diffusion-models", "classifier-free-guidance", "multimodal-models"],
    sections: [
      {
        title: "The Text-to-Image Revolution",
        content: `Text-to-image generation is the most visually striking application of generative AI. In 2022, Stable Diffusion, Midjourney, and DALL-E 2 became available to the public and demonstrated that anyone could create professional-quality images from text descriptions.

The pipeline typically involves: a text encoder (usually CLIP) that converts the text prompt to an embedding, a diffusion model that generates in a compressed latent space, and a decoder (VAE decoder) that converts the latent to a full-resolution image.

The key enabling technique is classifier-free guidance (CFG), which amplifies the influence of the text conditioning, making images much more faithful to the prompt.`
      },
      {
        title: "Stable Diffusion Architecture",
        content: `Stable Diffusion is a Latent Diffusion Model (LDM). Key components:

VAE: An autoencoder compresses 512×512×3 pixel images to 64×64×4 latent representations. Diffusion happens in this smaller latent space, then the VAE decoder upsamples back.

Text Encoder: CLIP's text encoder converts the prompt to a 768-dimensional embedding sequence.

U-Net: The denoising network. A U-Net with transformer blocks at multiple scales. Text conditioning is injected via cross-attention — each spatial position can attend to all prompt tokens.

CLIP: Provides both the text encoder and was used for training guidance. CLIP learned joint image-text representations, which enables text-guided generation.

Training: The model is trained on massive image-text datasets (LAION-5B — 5 billion image-text pairs from the internet). Each training step: encode image to latent → add noise → predict noise conditioned on text → update weights.`
      },
      {
        title: "Inpainting, Outpainting, and Editing",
        content: `Beyond text-to-image, diffusion models enable powerful image editing:

Inpainting: Fill in a masked region of an image. The model generates content for the masked area consistent with the rest of the image and the text prompt. Used for removing objects, replacing backgrounds, filling in missing areas.

Outpainting: Extend an image beyond its borders by generating new content. The model must infer what plausibly continues outside the frame.

Image-to-Image (img2img): Start from an existing image instead of pure noise. The model adds noise to the input image and denoises from there, creating variations that preserve the general structure while changing details.

ControlNet: A fine-tuned extension that conditions on structural signals — edge maps, depth maps, pose keypoints, segmentation masks. Enables precise control over composition, pose, and structure while letting the model fill in style and texture.

DreamBooth / Textual Inversion: Fine-tune Stable Diffusion on a few images of a specific subject (person, object, style), teaching the model a new concept. You can then generate that subject in any style or scenario.`
      }
    ]
  },
  {
    id: 20,
    slug: "ai-agents",
    title: "AI Agents",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 15,
    description: "ReAct, tool use, planning, memory, and how LLMs become autonomous agents capable of multi-step tasks.",
    relatedSlugs: ["large-language-models", "rag", "prompt-engineering"],
    sections: [
      {
        title: "What is an AI Agent?",
        content: `An AI agent is a system where an LLM is used not just to answer a single question, but to autonomously take actions over time to accomplish a goal. Agents can use tools, maintain memory, plan multi-step solutions, and act in the world.

The key ingredients:
1. Planning: Breaking complex goals into sub-tasks
2. Tool Use: Calling external APIs, running code, searching the web, reading files
3. Memory: Maintaining context across many steps (short-term) and between sessions (long-term)
4. Reflection: Evaluating progress and adjusting the plan

Agents represent a shift from "LLM as a question-answerer" to "LLM as an autonomous problem-solver."`
      },
      {
        title: "ReAct: Reasoning + Acting",
        content: `ReAct (Yao et al., 2022) is the foundational framework for LLM agents. The core idea: interleave reasoning traces and action execution.

The agent produces alternating:
- Thought: Internal reasoning about the current state and what to do next
- Action: A concrete action to take (search, calculate, look up, write)
- Observation: The result returned by the action

Example:
Thought: I need to find the population of Tokyo and compare it to New York.
Action: Search("Tokyo population 2024")
Observation: Tokyo metropolitan area has ~37 million people.
Thought: Now I need New York's population.
Action: Search("New York population 2024")
Observation: New York metro area has ~20 million people.
Thought: I can now compare. Tokyo is roughly 1.85× larger.
Answer: Tokyo's metropolitan area (~37M) is approximately 1.85× the size of New York's (~20M).

This trace-based approach enables complex multi-hop reasoning while making agent behavior transparent and debuggable.`
      },
      {
        title: "Tool Use and Function Calling",
        content: `Modern LLMs support structured tool use via function calling. The developer defines a set of tools as JSON schemas (name, description, parameters). The LLM can decide to call a tool, generate the arguments, receive the result, and incorporate it into the response.

Common agent tools:
- Web search: Retrieve current information
- Code interpreter: Execute Python code and return results (crucial for math, data analysis)
- File system: Read and write files
- Browser: Navigate web pages, fill forms, click
- API calls: Interact with external services (calendars, databases, email)
- Database queries: SQL or semantic search over structured data

The agent framework orchestrates: detecting tool calls, executing them, feeding results back to the LLM, and repeating until the task is complete.`
      },
      {
        title: "Memory Systems",
        content: `A simple agent processes each interaction independently — no memory. Real agents need memory:

Working Memory (Short-term): The context window. Everything in the current prompt/conversation. Limited by context length, typically 4K–128K tokens.

External Memory (Long-term): A database outside the model. The agent reads from and writes to this store. Implementations: vector database (semantic retrieval), key-value store (exact lookup), structured database (SQL queries).

Memory types by content:
- Episodic memory: Records of past interactions ("Last week, the user asked about X")
- Semantic memory: General knowledge, facts, concepts
- Procedural memory: How to do things (skills, workflows)

Memory management is an open research challenge: what to store, when to retrieve, how to avoid context pollution from irrelevant old memories.`
      }
    ]
  },
  {
    id: 21,
    slug: "scaling-laws",
    title: "Scaling Laws",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 11,
    description: "Chinchilla laws, compute-optimal training, emergent abilities, and why scale matters for AI capability.",
    relatedSlugs: ["large-language-models", "training-vs-inference", "moe"],
    sections: [
      {
        title: "The Power Law Relationship",
        content: `Scaling laws describe how model performance improves as you increase model size, training data, and compute. The remarkable finding: these relationships follow power laws — predictable mathematical relationships that hold over many orders of magnitude.

Kaplan et al. (OpenAI, 2020) showed:
- Loss ∝ N^(-0.076) where N is number of parameters (keep data fixed)
- Loss ∝ D^(-0.095) where D is dataset size (keep parameters fixed)
- Loss ∝ C^(-0.050) where C is total compute

These power law exponents mean every time you multiply compute by 10, you can expect a predictable reduction in loss. This predictability is valuable: you can forecast the performance of a model before training it.`
      },
      {
        title: "Chinchilla: Compute-Optimal Training",
        content: `A key finding from Kaplan et al. was that the largest models were undertrained — for a given compute budget, it's often better to train a larger model for fewer steps... but how large and how long?

Hoffman et al. (DeepMind, 2022) revisited this with the "Chinchilla" paper, training models of varying sizes on varying amounts of data with controlled compute budgets. Their finding: for compute-optimal training, scale model parameters and training tokens roughly equally.

Chinchilla's rule of thumb: train on ~20 tokens per parameter. A 70B model should train on ~1.4 trillion tokens.

This was surprising because GPT-3 (175B parameters) was trained on only 300B tokens — far less than Chinchilla-optimal. The Chinchilla-sized model (70B) trained on 1.4T tokens outperformed the much larger but undertrained GPT-3.

The implication for deployment: smaller models trained on more data are often better than larger models trained on less. LLaMA, Mistral, and subsequent open-source models applied this insight.`
      },
      {
        title: "Emergent Abilities",
        content: `Perhaps the most surprising aspect of scaling: some capabilities appear suddenly as models cross certain scale thresholds. These are "emergent abilities" — behaviors that are essentially absent in smaller models and appear sharply in larger ones.

Examples of emergent abilities:
- Multi-step arithmetic: Smaller models fail; beyond ~50B parameters, models can do 3-4 digit arithmetic
- Chain-of-thought reasoning: Appears in models ~100B+ parameters
- In-context learning: Few-shot learning improves drastically with scale
- Instruction following: The ability to follow complex, novel instructions

The emergence phenomenon is both exciting and concerning. Exciting because it suggests larger models may develop entirely new capabilities we haven't predicted. Concerning because capabilities may appear suddenly in ways that make safety testing difficult — a capability absent in a smaller tested model may appear in the deployed larger version.`
      }
    ]
  },
  {
    id: 22,
    slug: "moe",
    title: "Mixture of Experts (MoE)",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 12,
    description: "Sparse MoE, routing mechanisms, Mistral MoE, and how to build larger models that are efficient at inference.",
    relatedSlugs: ["transformers", "large-language-models", "scaling-laws"],
    sections: [
      {
        title: "The MoE Idea",
        content: `Mixture of Experts is an architecture that decouples model capacity from computational cost. Instead of every parameter being used for every input, MoE has a collection of "expert" networks and a "router" that selects a small subset of experts for each input token.

A standard dense transformer: every token uses every parameter. A sparse MoE transformer: every token uses ~2 of 8 (or 8 of 64) expert networks. You can have 8× more parameters for the same FLOPs.

Intuition: different parts of the model can specialize. Some experts might focus on code, others on science, others on language. The router learns to direct each token to the most relevant experts.`
      },
      {
        title: "Architecture Details",
        content: `In a MoE transformer, the feed-forward layers (FFN) are replaced with MoE layers. Each MoE layer has E experts (each an FFN) and a gating network (router).

Router: A linear layer that takes the token embedding as input and outputs a score for each expert. Top-k experts (typically k=2) are selected, and their outputs are weighted by the gating scores.

h = Σᵢ∈topk gᵢ × Expertᵢ(x)

where gᵢ are softmax-normalized scores of the selected experts.

Load balancing: If the router always selects the same experts, the others never get trained. Auxiliary loss terms encourage balanced utilization — each expert should receive approximately equal load.

Expert capacity: Each expert has a maximum capacity of tokens it can process per batch. Tokens "overflowing" capacity are dropped (or passed through a residual connection). Capacity factors trade off expert utilization vs. overflow.`
      },
      {
        title: "Notable MoE Models",
        content: `GShard and Switch Transformer (Google, 2021–2022): Early large-scale MoE implementations, scaling to trillions of parameters with sparse activation.

Mixtral 8x7B (Mistral AI, 2023): Open-source MoE model with 8 experts and top-2 routing. 46.7B total parameters, 12.9B active per token. Outperformed LLaMA 2 70B despite using fewer active parameters.

GPT-4 (estimated): Widely believed to be a MoE model with approximately 8 experts of ~220B parameters each, routing 2 experts per token — ~1.8T total, ~440B active.

Grok-1 (xAI, 2024): 314B total parameters, MoE with 25% active parameters. Open-sourced.

MoE models offer better scaling efficiency: you can grow total capacity cheaply (add more experts) while keeping inference costs controlled (only 2 experts activate per token). The main challenge is communication overhead in distributed training — experts may be on different GPUs, requiring cross-GPU communication for each MoE layer.`
      }
    ]
  },
  {
    id: 23,
    slug: "quantization",
    title: "Quantization & Model Compression",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 13,
    description: "INT8/INT4, GPTQ, AWQ, knowledge distillation, and pruning — making large models fast and small enough to deploy.",
    relatedSlugs: ["training-vs-inference", "lora", "large-language-models"],
    sections: [
      {
        title: "Why Compress Models?",
        content: `A 70B parameter model in fp16 (16-bit float) takes 140GB of GPU memory. Most organizations don't have 140GB GPU systems. Compression techniques reduce model size and inference cost, enabling deployment on smaller hardware.

Quantization, pruning, knowledge distillation, and speculative decoding are the main compression approaches. Quantization is by far the most widely used for LLMs because it achieves dramatic size reductions with minimal quality loss.`
      },
      {
        title: "Quantization Fundamentals",
        content: `Quantization reduces the numerical precision of model weights (and sometimes activations) from 32-bit or 16-bit floats to 8-bit or 4-bit integers.

fp32: 4 bytes/parameter. Standard training precision.
fp16/bf16: 2 bytes/parameter. Standard inference precision for large models.
INT8: 1 byte/parameter. 2× memory reduction vs. fp16.
INT4: 0.5 bytes/parameter. 4× memory reduction vs. fp16. A 70B model fits in ~35GB.

The challenge: low-bit integers have limited range. Mapping continuous weights to a small set of integer values introduces quantization error. The key question: how much performance degrades?

For LLMs, it turns out weights can be quantized quite aggressively with minimal quality loss, as long as care is taken around outliers — specific activation channels with very large magnitudes.`,
        code: `import torch

def quantize_weight(weight, bits=8):
    """Simple symmetric linear quantization."""
    qmin = -(2 ** (bits - 1))
    qmax = 2 ** (bits - 1) - 1
    
    # Compute scale factor
    absmax = weight.abs().max()
    scale = absmax / qmax
    
    # Quantize: round to nearest integer
    quantized = (weight / scale).round().clamp(qmin, qmax).to(torch.int8)
    
    # Dequantize: multiply back by scale
    dequantized = quantized.to(torch.float32) * scale
    
    error = (weight - dequantized).abs().mean()
    return quantized, scale, error`
      },
      {
        title: "GPTQ and AWQ",
        content: `Post-training quantization (PTQ) applies quantization after training, without any further weight updates. This is appealing because it doesn't require the expensive full training run, but naive PTQ causes quality degradation.

GPTQ (Frantar et al., 2022): Quantizes LLM weights to 4-bit by iteratively minimizing the quantization error using second-order information (Hessian matrix). Achieves INT4 quantization with minimal quality loss on a small calibration dataset. A 175B GPT-3 model can be quantized in ~4 GPU hours.

AWQ (Activation-aware Weight Quantization): Observes that not all weights are equally important for activation magnitude. Protects the most salient weights (those that interact with large activations) by keeping them at higher precision or scaling them before quantization. Often achieves better results than GPTQ.

GGUF (GGML Universal Format): Format used by llama.cpp for running quantized models on CPUs and Apple Silicon. Supports 2-8 bit quantization with mixed precision (different layers at different precisions).`
      },
      {
        title: "Knowledge Distillation and Pruning",
        content: `Knowledge Distillation trains a small "student" model to mimic a large "teacher" model. The student doesn't just learn from ground truth labels — it learns from the teacher's soft probability outputs, which contain richer information about the data structure.

L = (1-α) × L_CE(y, y_student) + α × T² × KL(softmax(z_teacher/T), softmax(z_student/T))

Where T is temperature (softening the distributions) and α balances the two objectives. DistilBERT (60% smaller than BERT, 97% performance) and TinyLlama are distilled models.

Pruning removes individual weights or entire heads/layers that contribute little to model output. Unstructured pruning removes individual weights (creating sparse tensors); structured pruning removes entire neurons, heads, or layers (hardware-friendly). Models can typically be pruned 30–50% with minimal quality loss if re-trained or fine-tuned afterward.`
      }
    ]
  },
  {
    id: 24,
    slug: "constitutional-ai",
    title: "Constitutional AI & Alignment",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 13,
    description: "Anthropic's approach to AI safety, Constitutional AI, RLAIF, and the challenge of making powerful AI systems helpful, harmless, and honest.",
    relatedSlugs: ["rlhf", "large-language-models", "ai-agents"],
    sections: [
      {
        title: "The Alignment Problem",
        content: `Building powerful AI systems is only half the challenge. The other half — alignment — is ensuring these systems behave in ways that are beneficial and consistent with human values. This is harder than it sounds.

The core challenge: we can specify objectives mathematically (maximize reward, minimize loss), but these proxies for what we actually care about are imperfect. A model optimizing for "helpful responses" might discover that making up confident-sounding answers increases engagement — even if those answers are wrong. A reward model might have subtle biases that get amplified through RL training.

Alignment research tries to ensure AI systems: do what we want (capability alignment), want what we want (value alignment), and are transparent about what they're doing (interpretability).`
      },
      {
        title: "Constitutional AI",
        content: `Constitutional AI (CAI), developed by Anthropic, is an approach to training AI systems to be helpful, harmless, and honest using a set of principles (the "constitution") rather than requiring extensive human labeling of specific harmful outputs.

The two-phase process:

Phase 1 — Supervised Learning from AI Feedback (SL-CAF):
1. Generate responses (including potentially harmful ones) from the model
2. Ask the model to critique those responses against constitutional principles
3. Ask the model to revise the response to be more aligned with principles
4. Fine-tune on the revised responses

Phase 2 — RL from AI Feedback (RLAIF):
1. Generate pairs of responses for many prompts
2. Use an AI judge (guided by the constitution) to label which response is better
3. Train a reward model on these AI-labeled preferences
4. Fine-tune with RL using this reward model

Key advantage: the AI can scale the feedback process without requiring humans to directly evaluate millions of potentially harmful examples.`
      },
      {
        title: "HHH: Helpful, Harmless, Honest",
        content: `Anthropic's alignment framework targets three properties:

Helpful: The model should assist users in achieving their goals effectively. Unhelpfulness is not the safe default — a model that refuses everything is useless.

Harmless: The model should avoid producing outputs that cause real-world harm — violence, manipulation, dangerous instructions, discriminatory content. This must be balanced against helpfulness (over-refusal is also a failure mode).

Honest: The model should be truthful, calibrated (acknowledge uncertainty), transparent about its limitations, and non-deceptive. It shouldn't pursue hidden agendas.

These objectives are sometimes in tension. A user asking for information about dangerous chemicals might be: a worried parent, a chemistry student, a safety professional, or someone with malicious intent. The model must navigate this uncertainty.

Red-teaming — having humans (or AIs) try to elicit harmful behavior — is an important evaluation technique. Models are tested with adversarial prompts before deployment.`
      }
    ]
  },
  {
    id: 25,
    slug: "multimodal-models",
    title: "Multimodal Models",
    category: "Applications",
    difficulty: "Advanced",
    readTime: 14,
    description: "CLIP, BLIP, GPT-4V, vision-language models, and how models process both images and text.",
    relatedSlugs: ["transformers", "image-generation", "large-language-models"],
    sections: [
      {
        title: "What are Multimodal Models?",
        content: `Multimodal models process and generate content across multiple modalities — most commonly images and text, but also audio, video, code, and more. They bridge the gap between different types of information, enabling tasks like visual question answering, image captioning, document understanding, and text-to-image generation.

The challenge: different modalities have very different representations. Text is discrete (tokens), images are continuous spatial signals. Combining them requires learning a shared representation space where related concepts from different modalities are close together.`
      },
      {
        title: "CLIP: Learning from Image-Text Pairs",
        content: `CLIP (Contrastive Language-Image Pretraining, OpenAI 2021) revolutionized vision-language understanding. Trained on 400 million image-text pairs scraped from the internet, CLIP learns joint embeddings where matching image-text pairs are close and non-matching pairs are far apart.

Training: For a batch of N (image, text) pairs, CLIP trains an image encoder and text encoder using contrastive loss. The encoders should produce similar vectors for matching pairs and dissimilar vectors for non-matching pairs.

Remarkable emergent capability: zero-shot image classification. Given image classes as text descriptions ("a photo of a cat"), CLIP can classify images it's never explicitly trained to classify — just by finding which text description matches the image best.

CLIP embeddings power many downstream systems: Stable Diffusion uses CLIP to encode text prompts, semantic image search uses CLIP embeddings, and it enables many zero-shot tasks.`
      },
      {
        title: "Vision-Language Models",
        content: `Vision-language models (VLMs) integrate visual understanding with language generation, enabling natural language interaction about images.

Architecture: Typically a vision encoder (ViT — Vision Transformer) processes the image into patch embeddings. A projection layer maps these to the LLM's embedding space. The LLM then processes both image and text tokens together.

Notable VLMs:
- GPT-4V: OpenAI's flagship, can analyze images, charts, documents, handwriting
- Claude 3: Strong at document understanding and visual reasoning
- Gemini 1.5: Google's natively multimodal model, trained on images, text, audio simultaneously
- LLaVA: Open-source VLM with impressive performance; connects LLaMA with CLIP vision

Applications: medical image analysis, document understanding, code screenshot analysis, visual math, autonomous driving perception, robotics.`
      }
    ]
  },
  {
    id: 26,
    slug: "classifier-free-guidance",
    title: "Classifier-Free Guidance",
    category: "Techniques",
    difficulty: "Advanced",
    readTime: 9,
    description: "How CFG enables strong text conditioning in diffusion models and why the guidance scale matters.",
    relatedSlugs: ["diffusion-models", "image-generation", "sampling-strategies"],
    sections: [
      {
        title: "The Problem: Weak Conditioning",
        content: `Early text-to-image models often produced images only loosely related to the prompt. The model learned the joint distribution P(image, text), but at inference time, conditioning on a specific text prompt didn't reliably steer the image toward that prompt.

The intuition for the fix: we want to generate images that are not just plausible given the text, but specifically typical of that text — strongly consistent with the prompt, not just weakly consistent.`
      },
      {
        title: "How CFG Works",
        content: `Classifier-Free Guidance trains a single model to operate both conditionally (with a text prompt) and unconditionally (without a prompt). During training, the conditioning information is randomly dropped (with ~10-20% probability), and the model learns to generate without it.

At inference time, two score estimates are computed: the conditional score (guided by the text) and the unconditional score. The guided score is extrapolated beyond the conditional score in a direction away from the unconditional:

ε̂_guided = ε̂_unconditional + w × (ε̂_conditional - ε̂_unconditional)

Where w is the guidance scale (CFG scale). This steers the generation to be more consistent with the prompt than even the best prompt-consistent images in the training distribution.

w=1: No guidance (pure conditional sampling)
w=7-12: Typical range for image generation (more prompt-adherent)
w>15: Often oversaturated, overly sharp — too extreme`
      },
      {
        title: "Trade-offs and Extensions",
        content: `CFG trades sample diversity for prompt fidelity. Higher guidance scale = more faithful to prompt, less variety, potentially worse image quality at extremes.

The guidance-diversity trade-off explains why Stable Diffusion's default CFG scale of 7.5 is a sweet spot — high enough for good prompt adherence, not so high that quality degrades.

Extensions:
Negative prompting: Provide an unconditional prompt (e.g., "blurry, low quality, ugly") to guide away from undesirable attributes. The denoising moves away from the negative prompt while moving toward the positive.

Perp-Neg: A variant that ensures the negative direction is perpendicular to the positive conditioning, reducing quality artifacts.

CFG++ and other variants: Recent work improves upon the original CFG formulation for better quality-diversity trade-offs.`
      }
    ]
  },
  {
    id: 27,
    slug: "speculative-decoding",
    title: "Speculative Decoding",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 10,
    description: "Draft models, verification, speedup factors, and how speculative decoding accelerates LLM inference 2–3×.",
    relatedSlugs: ["large-language-models", "training-vs-inference", "sampling-strategies"],
    sections: [
      {
        title: "The Inference Bottleneck",
        content: `LLM inference is autoregressive — each token is generated sequentially, with each step requiring a full forward pass through the model. This sequential dependency means you can't simply run multiple steps in parallel.

For large models, each token might take 50–200ms to generate. Generating 500 tokens takes 25–100 seconds. This latency is unacceptable for interactive applications.

GPU utilization is typically low during inference because the key-value cache (storing intermediate attention states) is read for each step, creating memory bandwidth bottlenecks rather than compute bottlenecks. The model is memory-bandwidth bound, not compute bound.`
      },
      {
        title: "The Speculative Decoding Algorithm",
        content: `Speculative decoding (Chen et al., 2023) uses a small "draft" model to generate multiple tokens quickly, then uses the large "target" model to verify all of them in a single parallel forward pass.

Algorithm:
1. The draft model generates K tokens sequentially (fast, cheap)
2. The target model runs one forward pass over the original context plus all K draft tokens simultaneously
3. Each draft token is accepted or rejected based on whether the target model agrees:
   - If target probability ≥ draft probability: accept with probability 1
   - Otherwise: accept with probability target_prob/draft_prob (rejection sampling)
4. Stop at the first rejection; resample that token from the target model
5. Repeat from step 1

This maintains the exact output distribution of the target model — speculative decoding produces statistically identical outputs to naive sampling. The speedup comes from accepted tokens being generated "for free" by the cheap draft model, with only one expensive target model forward pass per group of tokens.`
      },
      {
        title: "Speedups and Practical Considerations",
        content: `Speedups depend on the acceptance rate — how often the draft model's tokens match the target model's distribution. For well-matched draft/target pairs (like Llama 7B drafting for Llama 70B), acceptance rates of 80–90% are achievable, providing 2–3× speedup.

Self-speculation: Instead of a separate draft model, use early exit or a pruned version of the target model. Medusa adds multiple prediction heads to the target model to generate draft tokens without a separate model.

Hardware considerations: Speculative decoding is most beneficial on hardware where the target model is memory-bandwidth bound (which is most inference scenarios). It's less beneficial on very fast hardware where the bottleneck is elsewhere.

In production, speculative decoding is used by many LLM serving frameworks (vLLM, TensorRT-LLM) as a standard optimization for interactive use cases.`
      }
    ]
  },
  {
    id: 28,
    slug: "world-models",
    title: "World Models",
    category: "Advanced Research",
    difficulty: "Advanced",
    readTime: 11,
    description: "Model-based RL, Dreamer, video prediction as world modeling, and the path to AI that truly understands physical reality.",
    relatedSlugs: ["ai-agents", "diffusion-models", "large-language-models"],
    sections: [
      {
        title: "What is a World Model?",
        content: `A world model is an internal representation of the environment that allows an agent to predict future states and simulate consequences of actions — to "think through" what would happen before acting.

Humans use world models constantly. When you reach for a glass, your brain predicts how the glass will move, how it will feel, what happens if you knock it over — all without physically trying each option. This ability to simulate enables sophisticated planning.

For AI, world models bridge the gap between perception (what is happening) and planning (what to do). An agent with a good world model can plan effectively in novel situations without trial-and-error, reason about counterfactuals, and generalize beyond training experience.`
      },
      {
        title: "Dreamer and Model-Based RL",
        content: `Dreamer (Hafner et al., 2019–2023) is the most influential implementation of world models in reinforcement learning. Rather than learning directly from environment interactions (model-free RL), Dreamer learns a latent dynamics model and plans entirely within this model's "imagination."

Architecture:
- World model: Learn compact latent state representations and predict future states from actions
- Actor: A policy network that learns to act within imagined rollouts
- Critic: Evaluates states within imagination

Training: Alternate between collecting experience from the real environment (with the current policy), training the world model on collected experience, and training actor-critic within the world model's imagination.

Dreamer achieved superhuman performance on 150+ Atari games using far fewer environment interactions than model-free RL, demonstrating the data efficiency benefit of world models.`
      },
      {
        title: "Video Prediction as World Modeling",
        content: `A compelling view: video prediction models are world models. If you can accurately predict the next frame of a video given previous frames and actions, you've learned the physics and dynamics of that world.

Sora (OpenAI, 2024) generates realistic video from text descriptions. The model implicitly learns physical intuitions — how objects interact, how light behaves, how people move. Whether this constitutes a true "world model" is debated, but it demonstrates that generative models can capture rich dynamic structure.

Genie (DeepMind, 2024) learns an interactive world model from unlabeled internet videos. Given a sequence of frames, it infers the underlying actions and learns a model that can generate the next frame given an action — essentially learning a video game from watching videos.

The frontier: Developing world models that can reason about causality, support counterfactual reasoning, and transfer across different physical domains. This remains an open problem and a central challenge for achieving more general AI.`
      }
    ]
  }
];

export const learningPaths = {
  beginner: {
    title: "Beginner Path",
    subtitle: "Start here if you're new to AI",
    color: "from-emerald-500 to-teal-500",
    slugs: [
      "what-is-generative-ai",
      "history-of-ai",
      "neural-networks-basics",
      "probability-statistics",
      "loss-functions-optimization",
      "training-vs-inference",
    ]
  },
  intermediate: {
    title: "Intermediate Path",
    subtitle: "Core models & techniques",
    color: "from-violet-500 to-purple-500",
    slugs: [
      "transformers",
      "large-language-models",
      "vaes",
      "gans",
      "diffusion-models",
      "prompt-engineering",
      "fine-tuning",
      "lora",
      "rag",
      "embeddings",
      "sampling-strategies",
    ]
  },
  advanced: {
    title: "Advanced Path",
    subtitle: "Research frontiers & cutting-edge",
    color: "from-orange-500 to-rose-500",
    slugs: [
      "rlhf",
      "classifier-free-guidance",
      "image-generation",
      "multimodal-models",
      "ai-agents",
      "scaling-laws",
      "moe",
      "constitutional-ai",
      "quantization",
      "speculative-decoding",
      "world-models",
    ]
  }
};

export const resources = [
  {
    category: "Foundational Papers",
    items: [
      { title: "Attention Is All You Need", author: "Vaswani et al.", year: 2017, url: "https://arxiv.org/abs/1706.03762", description: "The transformer architecture that started it all." },
      { title: "Auto-Encoding Variational Bayes", author: "Kingma & Welling", year: 2013, url: "https://arxiv.org/abs/1312.6114", description: "The original VAE paper." },
      { title: "Generative Adversarial Nets", author: "Goodfellow et al.", year: 2014, url: "https://arxiv.org/abs/1406.2661", description: "The original GAN paper." },
      { title: "Denoising Diffusion Probabilistic Models", author: "Ho et al.", year: 2020, url: "https://arxiv.org/abs/2006.11239", description: "The DDPM paper that popularized diffusion models." },
      { title: "Training Language Models with RLHF", author: "Ouyang et al.", year: 2022, url: "https://arxiv.org/abs/2203.02155", description: "InstructGPT and the RLHF recipe." },
      { title: "Chinchilla: Compute-Optimal Training", author: "Hoffmann et al.", year: 2022, url: "https://arxiv.org/abs/2203.15556", description: "Scaling laws for compute-optimal LLMs." },
    ]
  },
  {
    category: "Courses & Books",
    items: [
      { title: "Deep Learning (Goodfellow et al.)", url: "https://www.deeplearningbook.org/", description: "The textbook for deep learning fundamentals. Free online." },
      { title: "fast.ai Practical Deep Learning", url: "https://course.fast.ai/", description: "Hands-on, top-down approach to deep learning." },
      { title: "Andrej Karpathy's Neural Networks Series", url: "https://www.youtube.com/@AndrejKarpathy", description: "Incredible from-scratch implementations and explanations." },
      { title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course/", description: "Practical transformer-based NLP with HuggingFace." },
    ]
  },
  {
    category: "Tools & Frameworks",
    items: [
      { title: "PyTorch", url: "https://pytorch.org/", description: "The primary framework for AI research and production." },
      { title: "Hugging Face Transformers", url: "https://huggingface.co/docs/transformers/", description: "The standard library for working with transformer models." },
      { title: "LangChain", url: "https://langchain.com/", description: "Framework for building LLM-powered applications." },
      { title: "Diffusers", url: "https://huggingface.co/docs/diffusers/", description: "Library for working with diffusion models." },
      { title: "vLLM", url: "https://vllm.ai/", description: "High-throughput LLM inference library." },
    ]
  }
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find(t => t.slug === slug);
}

export function getTopicsByCategory(category: Category): Topic[] {
  return topics.filter(t => t.category === category);
}

export function getTopicsByDifficulty(difficulty: Difficulty): Topic[] {
  return topics.filter(t => t.difficulty === difficulty);
}

export const categories: Category[] = ["Foundations", "Core Models", "Techniques", "Applications", "Advanced Research"];
export const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const categoryColors: Record<Category, string> = {
  "Foundations": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Core Models": "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  "Techniques": "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  "Applications": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Advanced Research": "bg-rose-500/20 text-rose-300 border border-rose-500/30",
};

export const difficultyColors: Record<Difficulty, string> = {
  "Beginner": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "Intermediate": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Advanced": "bg-rose-500/20 text-rose-300 border border-rose-500/30",
};
