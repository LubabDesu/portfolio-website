---
title: "What actually makes ML systems different from normal software"
slug: "mlsys-week1-intro"
description: "First week of ML Systems at UCSD. Covers the paradigm shift from traditional SWE to ML, the AI Systems Triangle, and what it means to deploy a model in the real world."
date: "2026-04-26"
tags: ["MLSys", "Systems", "Deployment", "AI Engineering"]
projectSlug: "mlsys"
status: "draft"
---

## 1. Introduction

I'm taking CSE 291 (ML Systems) this quarter at UCSD, and honestly the first week already reframed how I think about a lot of stuff. My background is mostly in the ML side, training models, understanding architectures, but the systems angle is something I've been wanting to dig into properly for a while. This post is basically my notes from week one, organized into something readable.

The core question week one tries to answer is: what's actually different about building ML systems compared to just building regular software? The answer is more interesting than I expected.

---

## 2. The paradigm shift

### 2.1 Code-dependent vs data-dependent

Traditional software is fundamentally code-dependent. You write the logic, the logic executes, you get a result. If the result is wrong, you trace back through your code and find the bug. The behavior of the system is entirely determined by what you wrote.

ML systems are data-dependent. The model's behavior is determined by the data it was trained on, not just the code you wrote to train it. You can have completely correct training code and still produce a totally useless model because the data had some issue you didn't catch. This sounds obvious when you write it out, but the implications are pretty significant for how you build and debug these systems.

### 2.2 Explicit vs silent failures

This was probably the most useful framing from week one. Traditional software fails loudly. Something crashes, throws an exception, returns an obviously wrong value. You know immediately that something is broken.

ML systems fail silently. The model keeps running, produces outputs, looks healthy by every traditional software metric, and is quietly giving you degraded or wrong answers because something upstream shifted. The canonical example the reading uses is recommendation systems: if you don't retrain on fresh data, your model will keep recommending things confidently, but the recommendations will gradually drift away from what users actually want as preferences change. No error is thrown. The system looks fine. The silent failure is the whole point of why MLSys is hard.

So a recommendation system where the underlying preferences of users have shifted could be, from a traditional SWE standpoint, "working perfectly", all the code runs, no errors, all endpoints respond, and yet be producing increasingly bad recommendations. That gap between "technically functional" and "actually doing the right thing" is unique to ML.

### 2.3 Historical context

The reading traces how we got here: Symbolic AI and Expert Systems first, where the logic was hand-coded by humans. Then Statistical Learning, where we started learning patterns from data. Then Deep Learning, which showed that with enough data and compute, learned representations could outperform hand-crafted features on almost everything.

The AlexNet moment (2012, or 2012?) is the inflection point: progress stopped being primarily about better algorithms and started being primarily constrained by compute and data. Hence MLSys as a field becomes important, because now the bottleneck is actually running and serving these things efficiently at scale, not just figuring out which algorithm to use.

---

## 3. The AI Systems Triangle

### 3.1 The three pillars

There's a framework from the reading I keep coming back to: the AI Systems Triangle, with three vertices: Models, Data, and Infrastructure.

The point isn't that these are three separate things you build, it's that they're deeply interdependent. The complexity of your model determines what infrastructure you need and how much data you need to train it. Your data strategy has to be balanced against what your infrastructure can actually process. Your infrastructure establishes the practical bounds on what models and data pipelines are feasible. You can't optimize any one of these in isolation without considering the others.

**Models** are the mathematical functions that learn patterns from data and make predictions. Their complexity directly affects storage and compute requirements, which ripples back to infrastructure needs.

**Data** is everything involved in collecting, storing, processing, and serving it, for both training and inference. The reading makes the point that data strategy has to be co-designed with the other two pillars, not treated as an afterthought.

**Infrastructure** is the hardware and software that actually runs all of this. And this one is foundational in a specific sense: it sets the ceiling on what the other two can do. You can't train a model that your infrastructure can't support, and you can't process data that your systems can't handle.

### 3.2 System design implications

The practical takeaway is that system design has to start with understanding infrastructure limits, then select models and data pipelines that fit within those limits, not the other way around. Which goes against the instinct of "figure out the best model first, then figure out how to run it," which I think is how a lot of ML practitioners (myself included, honestly) tend to think.

---

## 4. Deployment realities

### 4.1 Deployment decisions aren't an afterthought

This section was probably the most practically useful. The reading argues that deployment decisions ripple backwards through the entire system lifecycle. If you decide to deploy on edge devices, say, a phone or an embedded sensor, you've immediately constrained your model size, your data collection strategy, your training approach, and your evaluation metrics. You don't get to "figure that out later."

The example they use is pretty stark: deploying on edge vs. deploying in the cloud is basically a different engineering problem, not just a different configuration.

### 4.2 Waymo as a hybrid case

Waymo is used as an example of a system that spans both. Autonomous vehicles have to make real-time decisions on hardware that's physically inside the car (edge compute, custom on-vehicle chips), but they also run massive training simulations and fleet-wide learning in the cloud (Google data centers). So you have edge infrastructure handling latency-critical decisions and cloud infrastructure handling compute-intensive learning. The two systems have to interoperate, which means designing both from the start.

### 4.3 The spectrum from FarmBeats to AlphaFold

There's a whole spectrum of deployment contexts mentioned in the reading, from extremely resource-constrained edge deployments (FarmBeats, agricultural sensors with very limited compute) to massively compute-intensive cloud deployments (AlphaFold, which needs a huge amount of compute just for inference). Most real systems fall somewhere in the middle, but the key point is that where you fall on that spectrum should inform every other decision you make.

---

## 5. The 5 Pillars of AI Engineering

This is the framework the reading uses to organize the core challenges of building reliable ML systems. I'll go through each quickly.

**Data Engineering** is about managing messy real-world data at scale, quality assurance, detecting data drift, handling distribution shifts over time. The reading gives the example of traffic pattern data: if you trained on last year's data, your model might degrade as patterns change, and you need systems to catch that.

**Training Systems** is about allocating compute to actually train models. For large models this means coordinating training across thousands of GPUs, handling training failures and restarts, checkpointing, etc. Not just "run the training script," but managing the whole distributed training process reliably.

**Deployment Infrastructure** is the post-training half: actually serving the model in production. Serving at scale, handling failures gracefully, adapting to a changing world.

**Operations and Monitoring** is, honestly, the part I think gets underestimated the most. This is how you catch the silent failures we talked about earlier. Continuous monitoring of model behavior, detecting performance degradation, doing safe updates. ML-specific in a way that traditional software monitoring isn't, your metrics are "is the model still making good predictions" not just "is the service responding."

**Ethics and Governance** is transparency, interpretability, privacy, fairness. The reading treats this as a technical pillar alongside the others, not a separate organizational concern. I appreciate that framing, because I think treating ethics as purely a policy problem and not a systems design problem leads to a lot of the AI failures we see in practice.

---

## 6. Reflections

The main thing week one did for me is reframe the "ML failure" problem. I used to think of ML failures as "the model got something wrong," which is basically a stats problem. But the more interesting (and harder) failure modes are systemic: the model is working as intended, but the world has changed, or the deployment context doesn't match the training context, or the monitoring wasn't set up to catch the drift. Those failures are architecture problems and systems problems, not just model problems.

I'm looking forward to getting into the actual technical content in subsequent weeks, frameworks, hardware, compilers. But having this framing first feels like the right order.

---

## 7. Links & References

- Reddi, V.J., et al. (2024). *Machine Learning Systems*. https://mlsysbook.ai/
