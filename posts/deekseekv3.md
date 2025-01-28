---
title: (译)训练 Deepseek V3 究竟使用了多少算力？
date: 2025-01-27
---

译者按：
1. Deepseek-R1的成本主要取决于Deepseek-V3
2. Deepseek-V3的成本基本可信
3. Deepseek-V3的成本上的降低主要来自于由MoE带来的激活参数的减少、训练时部分参数量化（fp8）、以及一些infra的改进。

本文翻译自 [Deepseek-V3 Training Budget Fermi Estimation](https://planetbanatt.net/articles/v3fermi.html)，作者 Eryk Banatt。

---

#### Deepseek论文实际的主张的成本究竟是什么？

关于 [Deepseek-V3](https://arxiv.org/abs/2412.19437v1) 论文中表格的真实性，目前存在多种意见。论文声称模型的训练预算为 550 万美元。一些人甚至认为这是彻头彻尾的虚假陈述，或者是一种心理战术，目的是让美国的实验室追逐一个无法企及的目标。

首先，我认为围绕 Deepseek-V3 训练成本的讨论中可能存在较多的信息偏差或误解。更具体地说，通过避免使用一些含糊的表述，可以让这一话题的讨论更加明确。一些人对论文中提到的数字深信不疑，但实际上，Deepseek 发表的论文中提供了足够的细节，可以通过这些信息进行粗略估算，从而使讨论更贴近现实。

让我们重新审视这一话题：《Deepseek-V3》论文中的数字表明，他们使用了 2.788M（278.8 万）小时的 H800 GPU 时长进行训练。按照每小时 2 美元的 GPU 使用成本计算，这相当于 5.576M（557.6 万美元）。然而，2048 台 H800 的硬件成本远远高于 500 万美元，显然，这一计算没有包括研究费用、薪资、失败的训练尝试，以及办公场所的运营成本（例如支付清洁工费用等）。论文的核心主张是： **2.788M GPU 小时** 的使用成本约为 550 万美元，而这更像是他们将 GPU 按每小时 2 美元租赁出去所能获得的收益，而非实际训练开销。

因此，更具建设性的方式是完全抛开这些预算数字，专注于可以被量化和分析的部分：论文声称，使用 **2.788M GPU 小时**  在 14.8 万亿个 token 上完成了 Deepseek-V3 架构的训练。这是一个更加明确的指标，也更便于进一步讨论和验证。

![cost of Deepseek-V3](https://pic.fallen.moe/DSV3/cost.jpg)

#### 估算FLOPS
在讨论前，先快速回顾一下[浮点操作](https://en.wikipedia.org/wiki/Floating_point_operations_per_second)（Floating Point Operations，简称 "FLOPs"）是什么。这是衡量计算性能的一种重要方式。现代 GPU 擅长以不同格式操作浮点数，这使其在多种机器学习应用中极为有用。由于我们知道前向传播和反向传播中活跃的参数数量，并且论文提供了训练所使用的 token 数量，我们可以通过估算总共使用的浮点操作数来推测训练需要花费的时间。

首先，了解相同 token 数量下的“正常”表现很有帮助。Meta 的 Llama 3.1 (405B) 模型在 15 万亿 token 上的训练耗时为 30.84M GPU 小时。这是一个 4050 亿参数的稠密模型，使用全 bf16 格式训练，报告的 GPU 利用率约为 40%。我们可以以此为参考点进行计算。Deepseek-V3 总参数量为 6710 亿，但由于这是一个 Mixture-of-Experts（MoE）模型，每次前向和反向传播仅激活 370 亿参数。为了简单起见，我们先假设这是一个在 14.8 万亿 token 上训练的稠密 370 亿参数模型。如果我们像 Meta 训练Llama 3一样，训练这个模型需要多少成本？本文采用以下三种方式估计：

##### 1. 经验公式 Rule of thumb
Llama 3 在 15 万亿 token 上的训练耗时为 30.84M GPU 小时 (Deepseek-V3 花了  **2.788M GPU 小时**)，并报告了 $3.8 \times 10^{25}$ FLOPs 的计算量。这与经验公式(Rule of thumb)

$$ 6 \times parameters \times token$$
 
（即 $6 \times  405 \text{billion} \times 15 \text{trillion}  = 3.65 \times 10^{25} \text{FLOPs}$）一致。

相比之下，Deepseek-V3 的激活参数量为 370 亿，仅为 4050 亿的 9.1%。利用相同的经验公式计算可得：
$6 \times 37 \text{billion} \times 14.8 \text{trillion} = 3.29 \times 10^{24} \text{FLOPs}$

##### 2. 同比例估计
若直接利用Llama 3报告的数字估算可得：
$$ 3.8 \times 10^{25} \times \frac{14.8 \text{trillion tokens}}{15 \text{trillion tokens}} \times \frac{37 \text{billion parameters}}{405 \text{billion parameters}}= 3.41\times 10^{24} \text{FLOPs} $$

##### 3. 利用先前Deepseek的研究估计
我们还可以利用 (Deepseek-MoE)[https://arxiv.org/pdf/2401.06066] 的数据交叉验证：在该研究中，Deepseek-MoE 总参数为 1450 亿，激活参数为 222 亿，并报告了每 4000 tokens 消耗 $585.6  \text{TFLOPs} $。通过计算:
$$ 585.6 \text{TFLOPs} / (4000 \text{tokens} \times 122.2 \text{billion parameters})=6.59 \text{FLOPs/token/active parameter} $$
换言之，Deepseek在MoE训练中，每训练token $\cdot$ 活跃参数需要消耗6.59次浮点运算。

若假设DeepseekV3也有类似的效率，再结合数据计算：

$$ 6.59 \times 14.8 \text{trillion tokens} \times 37 \text{billion active parameters} = 3.61 \times 10^{24} \text{FLOPs} $$

用这三种不同的方式进行估算都得到了相近的结果，因此我们假设是合理的。

按照与 Llama 3 相同的GPU利用率计算（即大致相同的GPU时间内能处理的浮点运算次数相差不多）：
$(30.84 M \text{GPU hours} / 3.8 \times 10^{25} \text{FLOPs}) \times 3.29 \times 1024 \text{FLOPs} = 2.67 M \text{GPU hours}$

这个结果非常接近论文中报告的 2.788M GPU 小时。

简而言之，相较于 Llama 3 的训练，Deepseek-V3 的改进大致等于MoE带来的节约单次训练活跃参数数量，并且额外开销开销可控。此额外等于 MoE 模型增加的额外开销和从 H100 切换到 H800 带来的额外开销之总和。那么，额外开销真的可控吗？

#### 采用MoE架构和H800 GPU带来的额外开销

Deepseek-V3 使用 H800 而非 Llama 使用的 H100。虽然两者具有相同的理论峰值计算能力（TFLOPS），但 H800 的 [通信带宽(interconnection bandwidth)](https://www.fibermall.com/blog/nvidia-ai-chip.htm) 较低，仅为 H100 的 44%（400 GB/s 对比 900 GB/s）。此外，使用 Mixture-of-Experts (MoE) 会带来一定的固有开销。一个或许较为保守的估计是，MoE 开销和 H800 带宽限制的总影响会使训练时间增加一倍[^1]，这将训练时间推到大约 5.34M GPU 小时，约合 1060 万美元。这可以视为训练类似模型的“理论最高成本”的粗略上限。在 Llama 3 的训练速度下，如果架构中计算 FLOPs 的总开销约为 100%，这大致对应总计 1000 万美元的成本。

#### 降低成本的其他手段
降低这一数字的方法有两种：**加速训练过程** 或 **减少 MoE 的开销**。

**加速训练过程** 是最容易直接测量的。如前所述，Llama 3 使用全 bf16 精度训练。不同浮点格式的计算速度各异。例如，bf16（占用 2 字节）的计算速度通常慢于 fp8（占用 1 字节）。GPU 制造商经常会报告其 GPU 在不同浮点格式下的性能表现：单位时间内可以完成多少操作。在使用 fp8 的部分越多时，相比完全使用 bf16，模型运行速度会更快。这一点非常重要，因为 H800 在 fp8 和 bf16 格式下的理论 FLOPs 差别很大：fp8 大约为 4000 TFLOPs，而 bf16 则不到 2000 TFLOPs [Source](https://resources.nvidia.com/en-us-tensor-core/nvidia-tensor-core-gpu-datasheet)。

Deepseek-V3 论文的一个重要部分是关于混合精度训练的描述，即尽可能多地使用 fp8 替代 bf16。需要明确模型中各部分的量化方式：bf16 嵌入后，前 3 层为稠密层，采用 bf16 的注意力机制和 fp8/bf16 混合精度的 FFN（前馈网络）；接下来的 58 层是包含多头潜在注意力（Multi-head Latent Attention）的 MoE 模块，其中注意力机制、softmax 和投影部分使用 bf16，而主要的矩阵乘法部分使用 fp8。最终输出头则完全采用 fp16 精度。大致估算，约 80-85% 的架构使用 fp8，其余部分使用 bf16。

如果 80% 的网络使用 fp8，那么这部分的 FLOPs 将比 Llama 3 的训练快两倍[^2]。因此，我们可以计算：

$$ (5.34M \times 0.8 \times 0.5)+(5.34M \times 0.2)=3.2M GPU hours  $$

**减少 MoE 的开销**也是论文的一个重要部分。MoE 的负载均衡（Load-balancing MoE）、DualPipe，以及 V3 论文中提到的其他基础设施优化，可能会显著减少这一数字。那么需要减少多少开销才能达到论文中报告的数值？
$$
\frac{2.79}{3.20} = 0.87
$$
这意味着总开销从 100% 减少到 87%（减少了约 13%）。如果你是从事基础设施优化的研究人员，可以阅读论文中提出的改进，并自行评估这些改进是否足够可信。

#### 结论

这只是一些估算，我也有可能遗漏了某些重要因素，或者在某些地方做了不该有的假设。但总体来看，Deepseek 声称使用 2.788M GPU 小时，在 14.8T tokens 上训练了一个 671B 参数的 MoE（其中 37B 为激活参数），是相当可信的。这些 GPU 小时分布在 2048 个 H800 上，大约需要 1.8 个月的时间，这与论文中提到的“两个月”是一致的。

在 V3 论文中，有些内容是能够被验证的，例如训练该架构在特定 tokens 数量上的 FLOPs 消耗。而可能存在数据造假的方式包括：

1. Deepseek-V3 实际训练的 tokens 数远超过 14.8T[^3]。
2. Deepseek-V3 在训练基础设施上的优化没有超过 Llama 3，因此训练应该耗费约 3.2M GPU 小时，而不是 2.788M GPU 小时。
3. Deepseek 声称使用了 fp8 训练，但实际上使用的是 bf16。
4. 我对开销的估算是错误的，实际开销远高于 100%，且 V3 论文中的基础设施优化并未起作用。

以上这些情况对我来说都显得不太可能。我认为这些并不是质疑者真正针对的核心问题，更可能是因为某些人误解了最初的表述。他们可能将声明理解为“任何人用 500 万美元就能训练出 Deepseek-V3”，而实际上更弱的表述是“最终的训练耗费了价值 500 万美元的 GPU 小时”。

[^1]: 我假设通信开销为 1.6 倍，MoE 开销为 1.3 倍，则总开销为：1.6 × 1.3 = 2.08 倍开销。
从我对 MoE 和 H800 的理解来看，这些估值似乎足够合理。不过，这并非我的专长，因此如果有讨论认为这个假设完全错误，我也很乐意接受。这毕竟是一个费米问题（Fermi Problem），仅仅做数量级的估计。

[^2]: 这确实是一个略显简单化的估算，但作为数量级估计来说是个不错的起点。

[^3]: Qwen 2.5 Coder 在其基础模型 2.5 已经完成的 18T tokens 之上，又训练了 5.5T tokens，所以显然更大规模的训练早已有先例。但我认为，这似乎并不是质疑者关注的主要问题.


