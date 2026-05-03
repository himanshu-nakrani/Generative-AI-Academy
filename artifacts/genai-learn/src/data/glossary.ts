export interface GlossaryTerm {
  term: string;
  definition: string;
  topicSlug?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Attention Mechanism",
    definition: "A neural network operation that allows each position in a sequence to selectively focus on other positions when computing its representation. Scaled dot-product attention computes weighted sums of value vectors, with weights determined by query-key dot products. It is the foundational operation in all transformer-based models.",
    topicSlug: "attention-mechanism",
  },
  {
    term: "Autoencoder",
    definition: "A neural network trained to compress input data into a lower-dimensional latent representation (encoder) and then reconstruct the original input (decoder). The bottleneck forces the model to learn a compact, meaningful representation. Regular autoencoders produce deterministic latent codes, unlike VAEs.",
    topicSlug: "vaes",
  },
  {
    term: "AI Agent",
    definition: "A system where a large language model is used not just to answer single questions, but to autonomously plan and execute multi-step tasks by calling tools, browsing the web, writing and running code, and maintaining memory. Agents follow frameworks like ReAct (reason + act) to interleave thinking with action.",
    topicSlug: "ai-agents",
  },
  {
    term: "ALiBi (Attention with Linear Biases)",
    definition: "A positional encoding method that adds a linear bias directly to attention scores rather than using positional embeddings. It enables length extrapolation — models trained on short contexts can generalize to longer ones at inference time without further training.",
    topicSlug: "positional-encoding",
  },
  {
    term: "Backpropagation",
    definition: "The algorithm that computes the gradient of the loss function with respect to all model parameters by applying the chain rule of calculus backwards through the network. It enables gradient-based optimization by efficiently computing how each parameter should change to reduce the loss.",
    topicSlug: "neural-networks-basics",
  },
  {
    term: "Batch Normalization",
    definition: "A technique that normalizes the inputs to each layer across a mini-batch, typically followed by a learned scale and shift. It stabilizes training by reducing internal covariate shift, allows higher learning rates, and acts as a mild regularizer. Layer Normalization is the analog used inside transformers.",
    topicSlug: "neural-networks-basics",
  },
  {
    term: "Beam Search",
    definition: "A decoding strategy that maintains the top-k most probable partial sequences at each step (the 'beam'), rather than committing greedily to one token. It finds higher-probability overall sequences than greedy decoding but is slower and can produce repetitive or generic text.",
    topicSlug: "sampling-strategies",
  },
  {
    term: "BERT (Bidirectional Encoder Representations from Transformers)",
    definition: "A transformer encoder model pre-trained with masked language modeling (MLM) and next sentence prediction. Because it attends to both left and right context, it excels at understanding tasks (classification, QA, NER) rather than generation. Introduced by Google in 2018.",
    topicSlug: "transformers",
  },
  {
    term: "Chain-of-Thought (CoT) Prompting",
    definition: "A prompting technique where the model is instructed to produce intermediate reasoning steps before giving a final answer. CoT significantly improves performance on multi-step reasoning, math, and logical deduction tasks. 'Let's think step by step' is a common zero-shot CoT trigger phrase.",
    topicSlug: "prompt-engineering",
  },
  {
    term: "Chinchilla Scaling Laws",
    definition: "Empirical laws from DeepMind (2022) showing that for a fixed compute budget, the optimal strategy is to train a smaller model on more data than was previously assumed. The Chinchilla model (70B parameters, 1.4T tokens) outperformed GPT-3 despite being 4× smaller, establishing the 20 tokens-per-parameter rule of thumb.",
    topicSlug: "scaling-laws",
  },
  {
    term: "CLIP (Contrastive Language-Image Pretraining)",
    definition: "A model trained by OpenAI to learn aligned representations of images and text using contrastive learning on 400M image-caption pairs. At inference time, CLIP can classify images by comparing image embeddings to text embeddings without task-specific training. It underpins many text-to-image models.",
    topicSlug: "multimodal-models",
  },
  {
    term: "Classifier-Free Guidance (CFG)",
    definition: "A technique for improving text-conditioning in diffusion models by interpolating between conditional and unconditional model outputs. The guidance scale controls the tradeoff between sample fidelity (how well it matches the prompt) and diversity. High guidance produces images that closely match prompts but may be less varied.",
    topicSlug: "classifier-free-guidance",
  },
  {
    term: "Constitutional AI",
    definition: "An alignment approach by Anthropic that trains a model to critique and revise its own outputs using a written 'constitution' of principles, then uses the revised outputs for RLHF. This reduces reliance on human labelers for harmlessness feedback and makes the AI's values more transparent and consistent.",
    topicSlug: "constitutional-ai",
  },
  {
    term: "Context Window",
    definition: "The maximum number of tokens a transformer model can process in a single forward pass. Tokens outside the context window are not visible to the model. Common sizes range from 4K tokens (early GPT-3) to 1M+ tokens (Gemini 1.5). Larger context windows enable document understanding, long conversation history, and in-context learning from many examples.",
    topicSlug: "long-context",
  },
  {
    term: "Cosine Similarity",
    definition: "A measure of the angle between two vectors, computed as their dot product divided by the product of their magnitudes. It ranges from -1 (opposite) to 1 (identical). In embedding spaces, cosine similarity is the standard metric for measuring semantic similarity between words, sentences, or documents.",
    topicSlug: "embeddings",
  },
  {
    term: "Cross-Entropy Loss",
    definition: "A loss function that measures the divergence between a predicted probability distribution and the true label distribution. For language models, it measures how well the model predicts the next token given the context. Minimizing cross-entropy is equivalent to maximizing the likelihood of the training data.",
    topicSlug: "loss-functions-optimization",
  },
  {
    term: "Decoder (Transformer)",
    definition: "The component of a transformer architecture that generates output tokens autoregressively. It uses masked self-attention (to prevent attending to future positions) and cross-attention (to attend to the encoder output). GPT-style models are decoder-only; T5 and the original transformer use both encoder and decoder.",
    topicSlug: "transformers",
  },
  {
    term: "Diffusion Model",
    definition: "A generative model that learns to reverse a gradual noising process. During training, Gaussian noise is added to data over many steps; the model learns to predict and remove this noise. At inference, the model starts from pure noise and iteratively denoises it into a coherent image or other output. Stable Diffusion is the most widely used example.",
    topicSlug: "diffusion-models",
  },
  {
    term: "DPO (Direct Preference Optimization)",
    definition: "A simpler alternative to RLHF that skips the separate reward model training step. DPO directly fine-tunes the language model on preference pairs (chosen vs. rejected responses) using a special loss derived from the Bradley-Terry preference model. It achieves similar alignment results with less computational complexity.",
    topicSlug: "rlhf",
  },
  {
    term: "ELBO (Evidence Lower Bound)",
    definition: "The training objective for Variational Autoencoders. It equals the reconstruction accuracy of the data (how well the decoder reconstructs inputs from latent codes) minus the KL divergence between the approximate posterior and the prior. Maximizing the ELBO simultaneously encourages good reconstructions and a well-structured latent space.",
    topicSlug: "vaes",
  },
  {
    term: "Embedding",
    definition: "A dense, fixed-length vector that represents a discrete object (token, word, image, etc.) in a continuous vector space. Objects with similar meanings or functions are mapped to nearby points. Embeddings are learned during training and capture rich semantic relationships — the classic example: vector(King) − vector(Man) + vector(Woman) ≈ vector(Queen).",
    topicSlug: "embeddings",
  },
  {
    term: "Emergent Abilities",
    definition: "Capabilities that appear abruptly in large language models at certain scale thresholds, without being explicitly trained for. Examples include multi-step arithmetic, analogical reasoning, and code generation. Wei et al. (2022) documented this phenomenon; it remains debated whether emergence is a fundamental property of scale or an artifact of evaluation metrics.",
    topicSlug: "scaling-laws",
  },
  {
    term: "Encoder (Transformer)",
    definition: "The component of a transformer that processes the full input sequence and produces contextual representations. It uses bidirectional self-attention, meaning each token can attend to all other tokens. BERT is an encoder-only model. Encoders excel at understanding and retrieval tasks rather than generation.",
    topicSlug: "transformers",
  },
  {
    term: "Few-shot Learning",
    definition: "Using a small number of input-output examples in the prompt context to guide a model's behavior without any weight updates. Few-shot prompting leverages in-context learning — the model infers the pattern from the examples and applies it to new inputs. GPT-3 demonstrated surprisingly strong few-shot performance across diverse tasks.",
    topicSlug: "prompt-engineering",
  },
  {
    term: "Fine-tuning",
    definition: "Continuing to train a pre-trained model on task-specific or domain-specific data to improve performance on a target distribution. Fine-tuning adapts the pre-trained knowledge to new tasks while preserving general capabilities. Variants include full fine-tuning (all parameters), instruction tuning, and parameter-efficient methods like LoRA.",
    topicSlug: "fine-tuning",
  },
  {
    term: "Flash Attention",
    definition: "An IO-aware algorithm for computing exact attention in O(N) memory instead of O(N²). By fusing operations and carefully managing GPU SRAM/HBM transfers (tiling), it avoids materializing the full attention matrix. Flash Attention enables training and inference on much longer sequences than was previously practical.",
    topicSlug: "attention-mechanism",
  },
  {
    term: "GAN (Generative Adversarial Network)",
    definition: "A framework where two neural networks — a generator and a discriminator — compete in a zero-sum game. The generator creates fake samples; the discriminator tries to distinguish real from fake. Through this adversarial training, the generator learns to produce increasingly realistic outputs. Introduced by Goodfellow et al. in 2014.",
    topicSlug: "gans",
  },
  {
    term: "Gradient Descent",
    definition: "An iterative optimization algorithm that updates model parameters in the direction of the negative gradient of the loss function. In practice, stochastic gradient descent (SGD) or mini-batch SGD is used. Modern variants like Adam and AdamW adapt per-parameter learning rates using gradient moment estimates.",
    topicSlug: "loss-functions-optimization",
  },
  {
    term: "Greedy Decoding",
    definition: "The simplest text generation strategy — at each step, select the single most probable next token. It is deterministic and fast but often produces repetitive, dull, or degenerate text because it ignores the fact that locally optimal choices may lead to globally poor sequences.",
    topicSlug: "sampling-strategies",
  },
  {
    term: "Hallucination",
    definition: "When a language model generates text that is fluent, confident, and plausible in style but factually incorrect, fabricated, or unsupported by the context. Hallucinations arise because LLMs are trained to produce likely continuations, not ground truth. RAG and chain-of-thought prompting can reduce hallucination rates.",
    topicSlug: "rag",
  },
  {
    term: "Hyperparameter",
    definition: "A configuration value set before training begins that controls the learning process rather than being learned from data. Common hyperparameters include learning rate, batch size, number of layers, attention heads, and dropout rate. Hyperparameter tuning finds values that maximize validation performance.",
    topicSlug: "training-vs-inference",
  },
  {
    term: "In-Context Learning",
    definition: "The ability of large language models to perform new tasks purely from examples or instructions in the prompt, without any gradient updates to model weights. This is the basis for few-shot and zero-shot prompting. It is an emergent ability that becomes more reliable with model scale.",
    topicSlug: "large-language-models",
  },
  {
    term: "Inference",
    definition: "The process of using a trained model to generate predictions, text, or images from new inputs. During inference, model weights are frozen — no learning happens. Inference is typically 10–100× less compute-intensive than training a single step, but serving millions of users at low latency is a major engineering challenge.",
    topicSlug: "training-vs-inference",
  },
  {
    term: "Jailbreak",
    definition: "An adversarial prompt that manipulates a language model into producing outputs that violate its safety guidelines — such as instructions for harmful activities, hate speech, or content the model was trained to refuse. Jailbreaks exploit the tension between instruction following and safety training. Related to prompt injection attacks.",
    topicSlug: "prompt-injection",
  },
  {
    term: "KL Divergence (Kullback-Leibler Divergence)",
    definition: "A measure of how much one probability distribution P diverges from a reference distribution Q. KL(P||Q) = Σ P(x) log(P(x)/Q(x)). It is asymmetric: KL(P||Q) ≠ KL(Q||P). In VAEs, the KL term in the ELBO regularizes the latent space; in RLHF, it prevents the fine-tuned model from drifting too far from the original.",
    topicSlug: "probability-statistics",
  },
  {
    term: "KV Cache",
    definition: "A memory optimization for transformer inference that stores previously computed key and value tensors from past tokens. Because attention keys and values for prior context do not change between decoding steps, caching them avoids redundant recomputation. KV cache size scales with sequence length × layers × heads and is a major memory bottleneck for long-context inference.",
    topicSlug: "speculative-decoding",
  },
  {
    term: "Latent Space",
    definition: "A compressed, lower-dimensional representation space learned by a generative model (VAE, diffusion model, GAN). Points in latent space correspond to meaningful data variations — for images, nearby latent points may produce similar faces or landscapes. Navigating latent space allows controlled generation and interpolation between outputs.",
    topicSlug: "vaes",
  },
  {
    term: "LoRA (Low-Rank Adaptation)",
    definition: "A parameter-efficient fine-tuning method that injects small trainable rank-decomposition matrices into each transformer layer while freezing the original weights. The update ΔW = BA where B and A are much smaller matrices. LoRA can reduce trainable parameters by 10,000× with comparable accuracy, enabling fine-tuning on consumer hardware.",
    topicSlug: "lora",
  },
  {
    term: "Loss Function",
    definition: "A function that measures the discrepancy between model predictions and ground truth targets. The choice of loss function encodes what 'being wrong' means for a task: MSE for regression, cross-entropy for classification/language modeling, ELBO for VAEs. Minimizing the loss through gradient descent is the core of neural network training.",
    topicSlug: "loss-functions-optimization",
  },
  {
    term: "Maximum Likelihood Estimation (MLE)",
    definition: "A method for estimating model parameters by finding values that maximize the probability of the observed training data under the model. Equivalent to minimizing negative log-likelihood, which equals cross-entropy loss for categorical distributions. MLE is the foundation of how language models are trained.",
    topicSlug: "probability-statistics",
  },
  {
    term: "Mechanistic Interpretability",
    definition: "A subfield of AI research that aims to reverse-engineer the computational algorithms implemented by neural networks. Rather than just observing input-output behavior, mechanistic interpretability identifies which circuits, attention heads, and neurons implement specific behaviors — such as induction heads for in-context learning or factual recall circuits.",
    topicSlug: "mechanistic-interpretability",
  },
  {
    term: "Mixture of Experts (MoE)",
    definition: "A neural network architecture with multiple specialized sub-networks (experts) and a routing mechanism that selects a sparse subset (typically 2) for each input token. MoE models have large total parameter counts but constant inference cost — Mixtral 8×7B has 47B parameters but computes like a 13B model on each forward pass.",
    topicSlug: "moe",
  },
  {
    term: "Multimodal Model",
    definition: "A model that processes and/or generates content across multiple data modalities, such as text, images, audio, and video. GPT-4V, Gemini, and LLaVA can take images as input alongside text. Multimodal models typically use modality-specific encoders whose outputs are projected into a shared representation space.",
    topicSlug: "multimodal-models",
  },
  {
    term: "Neural Network",
    definition: "A computational graph composed of layers of interconnected nodes (neurons), loosely inspired by the structure of the brain. Each neuron computes a weighted sum of its inputs, applies a nonlinear activation function, and passes the result to the next layer. The weights are learned by minimizing a loss function via backpropagation.",
    topicSlug: "neural-networks-basics",
  },
  {
    term: "Next-Token Prediction",
    definition: "The primary pre-training objective of GPT-style language models: given a sequence of tokens, predict the next token. Despite its simplicity, this task requires the model to develop broad knowledge of language, facts, reasoning, and code. It is equivalent to maximizing the likelihood of the training corpus.",
    topicSlug: "large-language-models",
  },
  {
    term: "Nucleus Sampling (Top-p)",
    definition: "A text generation strategy that samples from the smallest set of tokens whose cumulative probability exceeds a threshold p (e.g., 0.9). Unlike top-k which uses a fixed vocabulary size, top-p adapts to the model's confidence — using fewer tokens when the distribution is peaked, more when it is flat. Introduced by Holtzman et al. (2020).",
    topicSlug: "sampling-strategies",
  },
  {
    term: "Overfitting",
    definition: "When a model performs well on training data but poorly on unseen validation or test data, having learned spurious patterns specific to the training set rather than generalizable features. Common remedies include regularization (weight decay, dropout), more training data, and early stopping.",
    topicSlug: "loss-functions-optimization",
  },
  {
    term: "Parameter",
    definition: "A weight or bias value in a neural network that is updated during training. Modern LLMs have billions to trillions of parameters. The total parameter count is a rough proxy for model capacity, but efficiency depends heavily on architecture, training data quality, and how parameters are used (e.g., sparse MoE vs. dense).",
    topicSlug: "neural-networks-basics",
  },
  {
    term: "Perplexity",
    definition: "A standard measure of language model performance — the exponentiated average negative log-likelihood per token. Lower perplexity means the model assigns higher probability to the test text and is 'less surprised'. A perplexity of k means the model is as uncertain as if it had to choose uniformly from k options at each step.",
    topicSlug: "model-evaluation",
  },
  {
    term: "Positional Encoding",
    definition: "Information added to token embeddings that tells the transformer the position of each token in the sequence. Without it, attention is permutation-equivariant and the model cannot distinguish word order. Variants include sinusoidal encodings (original transformer), learned positional embeddings (BERT/GPT), RoPE, and ALiBi.",
    topicSlug: "positional-encoding",
  },
  {
    term: "Prompt",
    definition: "The text input provided to a language model that conditions its output. Prompts can include instructions, context, examples, and questions. The prompt is the primary interface for controlling LLM behavior without changing model weights. Prompt structure, wording, and ordering significantly affect output quality.",
    topicSlug: "prompt-engineering",
  },
  {
    term: "Prompt Engineering",
    definition: "The practice of systematically designing inputs to language models to elicit reliable, high-quality outputs. Techniques include few-shot examples, chain-of-thought reasoning, system prompts, role-playing, output format specification, and iterative refinement. Effective prompt engineering can substitute for fine-tuning in many practical applications.",
    topicSlug: "prompt-engineering",
  },
  {
    term: "Prompt Injection",
    definition: "An attack where malicious text in model inputs overrides the developer's intended instructions, causing the model to follow attacker commands instead. Direct injection targets the user's own prompt; indirect injection plants malicious instructions in external content the model processes (web pages, documents). A critical security concern for agentic AI systems.",
    topicSlug: "prompt-injection",
  },
  {
    term: "Quantization",
    definition: "Representing model weights and/or activations with fewer bits (e.g., 4-bit or 8-bit integers instead of 16-bit floats), reducing memory footprint and often increasing inference speed. Techniques like GPTQ and AWQ perform post-training quantization with minimal accuracy loss. QLoRA combines 4-bit quantization with LoRA fine-tuning.",
    topicSlug: "quantization",
  },
  {
    term: "RAG (Retrieval-Augmented Generation)",
    definition: "A technique that augments LLM generation by first retrieving relevant documents from an external knowledge base, then conditioning the model's response on both the query and retrieved context. RAG addresses LLM limitations of stale knowledge and hallucination by grounding responses in current, verifiable documents.",
    topicSlug: "rag",
  },
  {
    term: "RLHF (Reinforcement Learning from Human Feedback)",
    definition: "A training paradigm that improves LLM behavior by first training a reward model on human preference data (ranking model outputs), then fine-tuning the LLM using reinforcement learning (typically PPO) to maximize the reward model's score while constraining divergence from the original model. Used by InstructGPT, ChatGPT, and Claude.",
    topicSlug: "rlhf",
  },
  {
    term: "RoPE (Rotary Position Embedding)",
    definition: "A positional encoding method that encodes absolute position information by rotating query and key vectors in the complex plane. RoPE naturally encodes relative position information in the attention scores and allows context length extension via positional interpolation or extrapolation. Used in LLaMA, Mistral, Gemma, and most modern open LLMs.",
    topicSlug: "positional-encoding",
  },
  {
    term: "Sampling Temperature",
    definition: "A parameter (τ) that controls the randomness of text generation by dividing logits by τ before applying softmax. Temperature < 1 makes the distribution more peaked (less random, more deterministic). Temperature > 1 flattens it (more random). Temperature = 0 approximates greedy decoding. Temperature is the most commonly tuned generation parameter.",
    topicSlug: "sampling-strategies",
  },
  {
    term: "Self-Attention",
    definition: "Attention applied within a single sequence, where each position's query attends to all other positions' keys and values in the same sequence. It allows the model to build rich contextual representations where each token's meaning depends on the entire surrounding context. Multi-head self-attention runs multiple attention operations in parallel.",
    topicSlug: "attention-mechanism",
  },
  {
    term: "Softmax",
    definition: "A function that converts a vector of real-valued logits into a probability distribution (all values positive, summing to 1). softmax(zᵢ) = exp(zᵢ) / Σ exp(zⱼ). It is used at the output of language models to produce next-token probabilities, and within attention to compute attention weights over value vectors.",
    topicSlug: "neural-networks-basics",
  },
  {
    term: "Speculative Decoding",
    definition: "An inference acceleration technique where a small, fast draft model proposes multiple tokens at once, and the large target model verifies them in a single parallel forward pass. Correct tokens are accepted; incorrect ones are rejected and regenerated. Achieves 2–3× speedups over autoregressive decoding with identical output distribution.",
    topicSlug: "speculative-decoding",
  },
  {
    term: "Tokenization",
    definition: "The process of splitting text into discrete units called tokens before feeding it to a language model. Modern tokenizers (BPE, WordPiece, SentencePiece) split text into subword units, balancing vocabulary size against sequence length. A typical English word is 1–2 tokens; code and non-English text may tokenize less efficiently.",
    topicSlug: "tokenization",
  },
  {
    term: "Top-k Sampling",
    definition: "A text generation strategy that restricts sampling to only the k most probable next tokens, redistributing probability mass among them. Top-k prevents very unlikely tokens from being sampled but uses a fixed vocabulary size regardless of how peaked or flat the distribution is, which is the motivation for top-p (nucleus) sampling.",
    topicSlug: "sampling-strategies",
  },
  {
    term: "Transfer Learning",
    definition: "Reusing a model trained on a large general dataset as a starting point for a new, more specific task. In NLP, this typically means fine-tuning a pre-trained language model. Transfer learning dramatically reduces the data and compute needed for new tasks by leveraging representations learned from large corpora.",
    topicSlug: "fine-tuning",
  },
  {
    term: "Transformer",
    definition: "The dominant neural network architecture for language (and increasingly vision/audio) introduced by Vaswani et al. in 2017. Built from stacked blocks of multi-head self-attention and feed-forward layers with residual connections and layer normalization. Its ability to process sequences in parallel (unlike RNNs) and scale to billions of parameters made it the foundation of all modern LLMs.",
    topicSlug: "transformers",
  },
  {
    term: "VAE (Variational Autoencoder)",
    definition: "A generative model that encodes inputs into a distribution over latent space (rather than a single point) and decodes samples from that distribution. The training objective is the ELBO: reconstruction accuracy minus KL divergence from the prior. VAEs produce smooth, interpolatable latent spaces and are the foundation of latent diffusion models.",
    topicSlug: "vaes",
  },
  {
    term: "Vector Database",
    definition: "A database system optimized for storing, indexing, and querying high-dimensional embedding vectors by approximate nearest-neighbor (ANN) search. Essential for RAG pipelines, semantic search, and recommendation systems. Popular options include Pinecone, Weaviate, Qdrant, pgvector, and FAISS (an index library).",
    topicSlug: "rag",
  },
  {
    term: "Vector Quantization (VQ)",
    definition: "A technique that maps continuous vectors to a finite codebook of discrete codes, replacing the continuous latent space of a standard autoencoder with a set of learnable embedding vectors. VQ-VAE produces discrete tokens from images, enabling autoregressive generation of images using language model architectures. Used in DALL-E 1 and VQGAN.",
    topicSlug: "vector-quantization",
  },
  {
    term: "World Model",
    definition: "An internal representation that allows an agent to predict the future state of an environment given a current state and action, enabling it to 'imagine' consequences before acting. World models underpin model-based reinforcement learning (Dreamer). Generative video models like Sora can be viewed as implicit world models.",
    topicSlug: "world-models",
  },
  {
    term: "Zero-shot Learning",
    definition: "Using a model on a task without providing any task-specific examples — only a natural language instruction. Zero-shot performance tests how well a model has internalized task concepts during pre-training and instruction tuning. Models like GPT-4 and Claude show strong zero-shot performance across diverse tasks due to scale and instruction fine-tuning.",
    topicSlug: "prompt-engineering",
  },
  {
    term: "Synthetic Data",
    definition: "Training data generated by AI models rather than collected from real-world sources or human annotation. Used for data augmentation, privacy preservation, and scaling instruction tuning. Quality and diversity of synthetic data are critical to avoid model collapse.",
    topicSlug: "synthetic-data",
  },
  {
    term: "Self-Instruct",
    definition: "A paradigm where a language model generates its own instruction-response training pairs from a small set of seed examples. The model proposes new instructions, generates responses, and the filtered outputs become training data. Used in Alpaca and related instruction-tuned models.",
    topicSlug: "synthetic-data",
  },
  {
    term: "Model Collapse",
    definition: "A phenomenon where models trained recursively on their own outputs lose diversity and quality over generations. Each generation amplifies biases and loses coverage of the true data distribution, leading to increasingly homogeneous and degraded outputs.",
    topicSlug: "synthetic-data",
  },
  {
    term: "Agentic AI",
    definition: "AI systems that autonomously plan and execute multi-step tasks by calling tools, browsing the web, writing code, and maintaining memory. Unlike passive chatbots, agents can take consequential actions in the real world based on high-level goals.",
    topicSlug: "agentic-workflows",
  },
  {
    term: "Tool Use",
    definition: "The capability of language models to call external functions, APIs, or programs to accomplish tasks beyond pure text generation. Tools extend model capabilities to include search, code execution, database queries, and real-world actions.",
    topicSlug: "agentic-workflows",
  },
  {
    term: "Planning (AI)",
    definition: "The process by which an AI agent breaks down high-level goals into executable sub-tasks. Strategies include chain-of-thought reasoning, tree-of-thoughts exploration, hierarchical decomposition, and iterative replanning based on observations.",
    topicSlug: "agentic-workflows",
  },
  {
    term: "Knowledge Distillation",
    definition: "A technique for transferring knowledge from a large teacher model to a smaller student model. The student learns to mimic the teacher's soft probability distributions, capturing 'dark knowledge' about relationships between outputs that hard labels don't convey.",
    topicSlug: "model-distillation",
  },
  {
    term: "Soft Labels",
    definition: "Probability distributions over possible outputs rather than single correct answers (hard labels). In distillation, soft labels from a teacher model reveal relative plausibilities — e.g., that 'Lyon' is more reasonable than 'Tokyo' as an answer, even if 'Paris' is correct.",
    topicSlug: "model-distillation",
  },
  {
    term: "Dark Knowledge",
    definition: "Information captured in a model's soft probability distributions that is lost when converting to hard labels. For example, a model's small probability for a related class reveals semantic relationships. Distillation preserves dark knowledge by training on soft outputs.",
    topicSlug: "model-distillation",
  },
  {
    term: "AI Bias",
    definition: "Systematic errors in AI outputs that unfairly favor or disfavor certain groups. Sources include representation bias (underrepresentation in training data), label bias (historical discrimination reflected in labels), and measurement bias (features that correlate with protected attributes).",
    topicSlug: "ai-ethics",
  },
  {
    term: "Fairness (AI)",
    definition: "The property of AI systems treating individuals or groups equitably. Multiple definitions exist including demographic parity (equal positive rates), equalized odds (equal error rates), and individual fairness (similar treatment for similar individuals). These definitions are often mathematically incompatible.",
    topicSlug: "ai-ethics",
  },
  {
    term: "Model Card",
    definition: "A documentation framework for machine learning models that describes intended uses, limitations, training data, evaluation results, and ethical considerations. Model cards promote transparency and help users understand whether a model is appropriate for their use case.",
    topicSlug: "ai-ethics",
  },
  {
    term: "Red Teaming",
    definition: "The practice of systematically probing AI systems for vulnerabilities, failure modes, and harmful behaviors before deployment. Red teams try to elicit dangerous outputs, find jailbreaks, test safety guardrails, and identify biases through adversarial testing.",
    topicSlug: "ai-ethics",
  },
  {
    term: "Evol-Instruct",
    definition: "A technique for generating increasingly complex training instructions by prompting a model to 'evolve' existing simple instructions into harder versions. Used to create curricula of progressively challenging tasks for instruction tuning.",
    topicSlug: "synthetic-data",
  },
  {
    term: "Least Privilege",
    definition: "A security principle where AI agents are given only the minimum permissions necessary for their task. An agent that needs to read files should not have write access; one that queries databases should not have delete permissions. Critical for agentic AI safety.",
    topicSlug: "agentic-workflows",
  },
  {
    term: "Scratchpad",
    definition: "A working memory area in an agent's prompt where intermediate reasoning, observations, and notes are accumulated across steps. The scratchpad helps maintain task state within the context window and enables multi-step reasoning.",
    topicSlug: "agentic-workflows",
  },
  {
    term: "Teacher Model",
    definition: "A large, high-capability model whose outputs are used to train a smaller student model in knowledge distillation. The teacher provides soft probability distributions or generated text that the student learns to approximate.",
    topicSlug: "model-distillation",
  },
  {
    term: "Student Model",
    definition: "A smaller, more efficient model trained to approximate a larger teacher model's behavior through knowledge distillation. Students aim to achieve most of the teacher's capability at a fraction of the computational cost.",
    topicSlug: "model-distillation",
  },
  {
    term: "Explainability",
    definition: "The ability to describe why an AI system produced a particular output in terms humans can understand. Approaches include feature attribution, attention visualization, example-based explanations, and natural language rationales. Required by regulations for high-stakes decisions.",
    topicSlug: "ai-ethics",
  },
];

export const glossaryByLetter = glossaryTerms
  .slice()
  .sort((a, b) => a.term.localeCompare(b.term))
  .reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

export const glossaryLetters = Object.keys(glossaryByLetter).sort();
